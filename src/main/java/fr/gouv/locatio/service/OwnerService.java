package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.*;
import fr.gouv.locatio.repository.*;
import fr.gouv.locatio.security.SubscriptionStatus;
import org.apache.commons.lang3.RandomStringUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class OwnerService {

    @Autowired
    MailService mailService;

    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private PasswordRecoveryTokenRepository passwordRecoveryTokenRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private OwnerApartmentSharingRepository ownerApartmentSharingRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private TenantService tenantService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApartmentSharingService apartmentSharingService;

    @Value("${domain.url}")
    private String domainURL;

    private Locale locale = LocaleContextHolder.getLocale();


    public void createOwnerAccount(Owner owner, String tokenTenant) {
        Owner ownerDB = ownerRepository.findOneByEmail(owner.getEmail());
        if (ownerDB == null) {
            owner.setCreationDateTime(new LocalDateTime());
            owner.setToken(RandomStringUtils.randomAlphanumeric(8));
            ownerRepository.save(owner);
            UserRole userRole = new UserRole(owner);
            userRoleRepository.save(userRole);
        } else {
            owner = ownerDB;
        }
        linkOwnerTenant(owner, tokenTenant);

        PasswordRecoveryToken passwordRecoveryToken = passwordRecoveryTokenRepository.findOneByUser(owner);
        if (passwordRecoveryToken == null) {
            passwordRecoveryToken = new PasswordRecoveryToken();
            passwordRecoveryToken.setUser(owner);
            passwordRecoveryToken.setExpirationDate((new LocalDateTime()).plusDays(1));
            passwordRecoveryToken.setToken(RandomStringUtils.randomAlphanumeric(8));
        } else {
            passwordRecoveryToken.setToken(RandomStringUtils.randomAlphanumeric(8));
            passwordRecoveryToken.setExpirationDate((new LocalDateTime()).plusDays(1));
        }
        passwordRecoveryTokenRepository.save(passwordRecoveryToken);


        String[] params = {domainURL + "/changer-de-mot-de-passe/" + passwordRecoveryToken.getToken()};
        String mailTitle = messageSource.getMessage("owner.create.account.mail.title", null, locale);
        String mailMessage = messageSource.getMessage("owner.create.account.mail.body", params, locale);

        mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", owner.getEmail(), "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
    }

    @Transactional
    public void linkOwnerTenant(Owner owner, String tenantToken) {
        if (null == tenantToken || !tenantToken.equals("")) {
            ApartmentSharing apartmentSharing = apartmentSharingService.findApartmentSharingByBothToken(tenantToken);
            if (apartmentSharing != null) {
                OwnerApartmentSharing ownerApartmentSharing = ownerApartmentSharingRepository.findOneByOwnerAndApartmentSharing(owner, apartmentSharing);
                if (ownerApartmentSharing == null) {
                    ownerApartmentSharing = new OwnerApartmentSharing(owner, apartmentSharing, tenantToken);
                    ownerApartmentSharingRepository.save(ownerApartmentSharing);
                }
            }
        }
    }

    public List<Owner> listSubscribedOwners() {
        return (List<Owner>) ownerRepository.findAll();
    }

    public void deleteSubscribedOwner(Integer subscriptionId) {
        Owner owner = ownerRepository.findOne(subscriptionId);
        ownerRepository.delete(owner);
    }

    public SubscriptionStatus subscribeTenant(String token, Boolean access, Tenant tenant) {
        Owner owner = ownerRepository.findOneByToken(token);
        if (owner == null) {
            return SubscriptionStatus.TOKEN_DOES_NOT_EXIST;
        }
        OwnerApartmentSharing ownerApartmentSharing = ownerApartmentSharingRepository.findOneByOwnerAndApartmentSharing(owner, tenant.getApartmentSharings().get(0));
        if (ownerApartmentSharing == null) {
            ownerApartmentSharing = new OwnerApartmentSharing(owner, tenant.getApartmentSharings().get(0), access);
        } else {
            ownerApartmentSharing.setAccessFull(access);
        }
        ownerApartmentSharingRepository.save(ownerApartmentSharing);

        if (tenant.getTenantFileStatus() == TenantFileStatus.VALIDATED) {
            String[] params = {tenant.getFirstName(), tenant.getLastName()};
            String mailTitle = messageSource.getMessage("tenant.subscribe.owner.mail.title", params, locale);
            String mailMessage = messageSource.getMessage("tenant.subscribe.owner.mail.body", params, locale);
            mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", owner.getEmail(), "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
        }
        return SubscriptionStatus.SUCCESS;
    }

    //move messages to messages.properties
    public String getStatusOwnerLink(String email, Owner ownerToken) {
        User user = userRepository.findOneByEmail(email);
        if (user instanceof Tenant) {
            Tenant tenant = (Tenant) user;
            ApartmentSharing apartmentSharing = tenantService.getApartmentSharing(tenant);
            if (apartmentSharing == null) {
                if (tenant.getTenantFileStatus() != TenantFileStatus.VALIDATED) {
                    return "You need validate your files";
                }
            } else {
                if (!apartmentSharingService.validateApartmentSharing(apartmentSharing) && apartmentSharing.getTenantApartmentSharing().equals(tenant)) {
                    return "Vous n'êtes pas autorisé à vous inscrire auprès de ce propriétaire : votre dossier n'est pas encore validé";
                }else if (!apartmentSharingService.validateApartmentSharing(apartmentSharing)){
                    return "Demandez au créateur de la colocation pour donner accès à votre dossier";
                }

            }
        } else if (user instanceof Owner) {
            if (ownerToken.equals(user)){
                return "Ceci est le lien que vous devez transmettre à vos locataires. Ces derniers pourront alors s'inscrire auprès de vous et apparaitront dans votre page personnelle";
            }else{
                return "Vous ne pouvez accéder à cette page";
            }
        }
        return null;
    }
}

package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.PasswordRecoveryToken;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.repository.PasswordRecoveryTokenRepository;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.security.ChangePasswordStatus;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordRecoveryTokenRepository passwordRecoveryTokenRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${domain.url}")
    private String domainURL;

    public void launchPasswordRecoveryProcedure(String recoveryEmail, boolean accountCreation) {
        User user = userRepository.findOneByEmail(recoveryEmail);
        if (null != user) {
            PasswordRecoveryToken passwordRecoveryToken = passwordRecoveryTokenRepository.findOneByUser(user);
            if (passwordRecoveryToken == null) {
                passwordRecoveryToken = new PasswordRecoveryToken();
                passwordRecoveryToken.setUser(user);
                passwordRecoveryToken.setExpirationDate((new LocalDateTime()).plusDays(1));
                passwordRecoveryToken.setToken(RandomStringUtils.randomAlphanumeric(8));
            } else {
                passwordRecoveryToken.setExpirationDate((new LocalDateTime()).plusDays(1));
                passwordRecoveryToken.setToken(RandomStringUtils.randomAlphanumeric(8));
            }
            passwordRecoveryTokenRepository.save(passwordRecoveryToken);
            String mailTitle = accountCreation ? "Bienvenue sur Locatio !" : "Mot de passe oublié !";
            String tokenLink = domainURL+"/changer-de-mot-de-passe/" + passwordRecoveryToken.getToken();

            String mailMessage = "Bonjour,<br/><br/>Vous avez fait une demande de changement de mot de passe. Pour obtenir un nouveau mot de passe cliquez sur le lien suivant :<br/><br/><a href=\"" + tokenLink + "\">" + tokenLink + "</a><br/><br/>L'équipe Locatio<br/><br/>Pour toute question, vous pouvez nous écrire à : contact@locatio.beta.gouv.fr";
            if (accountCreation) {
                mailMessage = "Bonjour,<br/><br/>Merci de faire confiance à Locatio. Pour activer votre compte, cliquez sur le lien suivant :<br/><br/><a href=\"" + tokenLink + "\">" + tokenLink + "</a><br/><br/>Vous recevrez un email dès que les pièces de votre dossier auront été vérifiées. Cette opération nous prend généralement moins de 24 heures.<br/><br/>Une fois votre dossier vérifié, vous pourrez l'envoyer directement sous forme d'un lien aux propriétaires de votre choix.<br/><br/>L'équipe Locatio<br/><br/>Pour toute question, vous pouvez nous écrire à : contact@locatio.beta.gouv.fr";
            }
            mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", recoveryEmail, "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
        }
    }

    @Transactional
    public ChangePasswordStatus changePassword(String token, String password, String passwordConfirmation) {
        PasswordRecoveryToken passwordRecoveryToken = passwordRecoveryTokenRepository.findByToken(token);
        if (null == passwordRecoveryToken) {
            return ChangePasswordStatus.TOKEN_DOES_NOT_EXIST;
        }
        if (passwordRecoveryToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ChangePasswordStatus.TOKEN_TOO_OLD;
        }
        if (StringUtils.isEmpty(password) || StringUtils.isEmpty(passwordConfirmation) || !password.equals(passwordConfirmation)) {
            return ChangePasswordStatus.WRONG_PASSWORD;
        }

        User user = passwordRecoveryToken.getUser();
        user.setPassword(bCryptPasswordEncoder.encode(password));
//        passwordRecoveryTokenRepository.delete(passwordRecoveryToken);
        user.setPasswordRecoveryToken(null);
        passwordRecoveryToken.setUser(null);
        userRepository.save(user);
        autologin(user.getEmail(), password);
        return ChangePasswordStatus.SUCCESS;
    }

    public void autologin(String username, String password) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());

        authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        if (usernamePasswordAuthenticationToken.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            User user = userRepository.findOneByEmail(username);
            user.setLastLoginDate(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    public void deleteOldAccount() {
        LocalDateTime threeWeekLater = LocalDateTime.now().minusWeeks(3);
        userRepository.deleteByLastLoginDateBefore(threeWeekLater);
    }


    public User find(int tenantId) {
        return userRepository.findOne(tenantId);
    }
}

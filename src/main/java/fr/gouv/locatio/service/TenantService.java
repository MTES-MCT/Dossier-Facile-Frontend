package fr.gouv.locatio.service;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.*;
import fr.gouv.locatio.repository.ApartmentSharingRepository;
import fr.gouv.locatio.model.Taxes;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.repository.UserRoleRepository;
import fr.gouv.locatio.service.file.process.FileUtilsLocatio;
import org.apache.commons.io.FilenameUtils;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.tomcat.util.http.fileupload.FileUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private ConfigurationService configurationService;

    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @Autowired
    private ApartmentSharingService apartmentSharingService;

    @Autowired
    private ApartmentSharingRepository apartmentSharingRepository;

    @Autowired
    private FileProcessService fileProcessService;

    @Autowired
    private StatisticService statisticService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${particulier.api.gouv.fr}")
    private String apiURL;

    @Value("${particulier.api.gouv.fr.token}")
    private String apiToken;

    @Value("${email.bcc}")
    private String emailBcc;

    @Value("${email.from}")
    private String emailFrom;

    private static final Map<Integer, String> myMap;

    static {
        Map<Integer, String> aMap = new HashMap<>();
        aMap.put(0, "bo.tenant.custom.email.option0");
        aMap.put(1, "bo.tenant.custom.email.option1");
        aMap.put(2, "bo.tenant.custom.email.option2");
        aMap.put(3, "bo.tenant.custom.email.option3");
        aMap.put(4, "bo.tenant.custom.email.option4");
        aMap.put(5, "bo.tenant.custom.email.option5");
        aMap.put(6, "bo.tenant.custom.email.option6");
        aMap.put(7, "bo.tenant.custom.email.option7");
        aMap.put(8, "bo.tenant.custom.email.option8");
        aMap.put(9, "bo.tenant.custom.email.option9");
        myMap = Collections.unmodifiableMap(aMap);
    }

    @Autowired
    private MessageSource messageSource;
    private Locale locale = LocaleContextHolder.getLocale();
    private static final Logger logger = LoggerFactory.getLogger(TenantService.class);

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public int createAccount(TenantDTO tenantDTO, String utmSource) {
        Tenant tenant = new Tenant(tenantDTO);
        if (tenantDTO.getHasGuarantor()) {
            tenant.setGuarantor(this.getGuarantor(tenantDTO, tenant));
        }
        if (!createFiles(tenant, tenantDTO, "", 0)) {
            return -1;
        }
        if (utmSource != null) {
            tenant.setPartnerId(utmSource);
        }
        tenantRepository.save(tenant);

        UserRole userRole = new UserRole(tenant);
        userRoleRepository.save(userRole);

        apartmentSharingService.createApartmentSharing(tenant, tenantDTO);

        userService.launchPasswordRecoveryProcedure(tenant.getEmail(), true);
        return tenant.getId();
    }

    private Guarantor getGuarantor(TenantDTO tenantDTO, Tenant tenant) {
        Guarantor guarantor = new Guarantor();
        guarantor.setFirstName(tenantDTO.getGuarantor().getFirstName().trim().replaceAll("\\s+", " "));
        guarantor.setLastName(tenantDTO.getGuarantor().getLastName().trim().replaceAll("\\s+", " "));
        guarantor.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
        guarantor.setTenant(tenant);
        return guarantor;
    }

    public boolean createFiles(Tenant tenant, TenantDTO tenantDTO, String folderName, int fileNumber) {
        String uploadRootPath = configurationService.getUploads();
        if (folderName.equals("")) {
            folderName = (File.separator + String.valueOf(System.nanoTime()));
        }

        uploadRootPath += folderName;

        File uploadRootDir = new File(uploadRootPath);
        if (!uploadRootDir.exists()) {
            uploadRootDir.mkdirs();
        }
        MultipartFile[][] filesData = tenantDTO.getFiles();
        for (int i = 0; filesData != null && i < filesData.length; i++) {
            if (!filesData[i][0].getOriginalFilename().equals("")) {
                this.UploadFilesForTenantAndGuarantor(filesData[i], true, uploadRootDir, folderName, tenant, fileNumber != 0 ? fileNumber : i + 1);
            }
        }
        if (tenant.getGuarantor() != null && tenantDTO.getGuarantor().getFiles().length > 0) {
            MultipartFile[][] filesGuarantor = tenantDTO.getGuarantor().getFiles();
            for (int i = 0; i < filesGuarantor.length; i++) {
                if (!filesGuarantor[i][0].getOriginalFilename().equals("")) {
                    this.UploadFilesForTenantAndGuarantor(filesGuarantor[i], false, uploadRootDir, folderName, tenant, fileNumber != 0 ? fileNumber : i + 1);
                }
            }
        }

        return true;

    }


    private boolean UploadFilesForTenantAndGuarantor(MultipartFile[] multipartFile, boolean isTenant, File uploadRootDir, String folderName, Tenant tenant, int i) {
        String name = "";
        String filePath = "";
        PDFMergerUtility ut = new PDFMergerUtility();
        try {
            for (int j = 0; j < multipartFile.length; j++) {
                String originalName = multipartFile[j].getOriginalFilename();
                if (originalName != null && originalName.length() > 0) {
                    String ext = FilenameUtils.getExtension(originalName);
                    if (ext.equals("pdf")) {
                        ut.addSource(multipartFile[j].getInputStream());
                    } else {
                        ut.addSource(new ByteArrayInputStream(FileUtilsLocatio.convertImgToPDF(multipartFile[j])));
                    }
                }
            }
            name = String.valueOf(System.nanoTime() + "." + "pdf");
            ut.setDestinationFileName(uploadRootDir.getAbsolutePath() + File.separator + name);
            filePath = "/tenants_files" + folderName + File.separator + name;
            ut.mergeDocuments();
        } catch (IOException e) {
            logger.error(e.getMessage(), e.getCause());
            return false;
        }


        try {
            Method methodGet;
            String UploadX;
            if (isTenant) {
                methodGet = Tenant.class.getDeclaredMethod("getUpload" + i);
                UploadX = (String) methodGet.invoke(tenant);
            } else {
                methodGet = Guarantor.class.getDeclaredMethod("getUpload" + i);
                UploadX = (String) methodGet.invoke(tenant.getGuarantor());

            }
            if (UploadX != null && !UploadX.isEmpty()) {
                File serverFile = new File(configurationService.getUploads() + UploadX.substring(14, UploadX.length()));
                serverFile.delete();
            }
            Method methodSet;
            if (isTenant) {
                methodSet = Tenant.class.getDeclaredMethod("setUpload" + i, String.class);
                methodSet.invoke(tenant, filePath);
            } else {
                methodSet = Guarantor.class.getDeclaredMethod("setUpload" + i, String.class);
                methodSet.invoke(tenant.getGuarantor(), filePath);
            }
        } catch (NoSuchMethodException e) {
            logger.error(e.getMessage(), e.getCause());
            return false;
        } catch (IllegalAccessException e) {
            logger.error(e.getMessage(), e.getCause());
            return false;
        } catch (InvocationTargetException e) {
            logger.error(e.getMessage(), e.getCause());
            return false;
        }
        return true;
    }

    public List<Tenant> listTenants() {
        return (List<Tenant>) tenantRepository.findAll();
    }

    public void deleteTenant(Integer tenantId) throws IOException {
        Tenant tenant = tenantRepository.findOne(tenantId);
        if (null != tenant) {
            tenantRepository.delete(tenant);
            File serverFile = new File(configurationService.getUploads() + tenant.getUpload1());
            File tenantFolder = serverFile.getParentFile();
            serverFile.delete();

            serverFile = new File(configurationService.getUploads() + tenant.getUpload2());
            serverFile.delete();

            serverFile = new File(configurationService.getUploads() + tenant.getUpload3());
            serverFile.delete();

            serverFile = new File(configurationService.getUploads() + tenant.getUpload4());
            serverFile.delete();

            serverFile = new File(configurationService.getUploads() + tenant.getUpload5());
            serverFile.delete();

            FileUtils.deleteDirectory(tenantFolder);
        }
    }

    public Tenant displayTenantAccount() {
        if (SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken) {
            return null;
        }
        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return tenantRepository.findOneByEmail(user.getUsername());
    }


    @Transactional
    public void validateTenantFile(Integer tenantId) throws IOException {
        Tenant tenant = tenantRepository.findOne(tenantId);

        if (null != tenant) {
            tenant.setTenantFileStatus(TenantFileStatus.VALIDATED);
            if (tenant.getApartmentSharings().size() > 0) {
                apartmentSharingService.validateApartmentSharing(tenant.getApartmentSharings().get(0));
            } else {
                apartmentSharingService.validateApartmentSharing(tenant.getJoinedApartmentSharings().get(0));
            }

            String mailTitle = "Votre dossier a été validé";
            String mailMessage = "Bonjour,<br/><br/>Nous avons effectué une série de tests et nous n'avons pas détecté d'anomalie dans votre dossier&nbsp;!<br/><br/>Pour rassurer votre (futur) propriétaire et augmenter vos chances d'obtenir une visite, rendez-vous sur votre compte locatio pour générer le lien unique pointant vers les pièces de votre dossier.<br/><br/>Une fois ce lien généré, il vous suffira simplement de le transmettre aux propriétaires par mail, sms ou via les messageries des sites d'annonces. Une prise de contact contenant un lien locatio a 25% de chances supplémentaires d'obtenir une visite.<br/><br/><a href=\"https://locatio.beta.gouv.fr/locataire/mon-compte\">https://locatio.beta.gouv.fr/locataire/mon-compte</a><br/><br/>Si vous avez une question ou un doute, n'hésitez pas à nous contacter à contact@locatio.beta.gouv.fr<br/><br/>Toute l'équipe de Locatio vous souhaite bonne chance pour votre recherche&nbsp;!";
            mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", tenant.getEmail(), "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
        }
    }

    public boolean particulierApi(Tenant tenant) throws IOException {
        String pathToFile = configurationService.getUploads() + tenant.getUpload4().replace("/tenants_files", "");
        //InfoFourFile infoFourFile = fileProcessService.extractInfoPDFText(pathToFile);
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-KEY", apiToken);
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<Taxes> response = restTemplate.exchange(apiURL + "/impots/svair?numeroFiscal=" + 12 + "&referenceAvis=" + 15, HttpMethod.GET, entity, Taxes.class);
        return true;
    }


    public Tenant findTenantFileFromToken(String token) {
        ApartmentSharing apartmentSharing = apartmentSharingRepository.findOneByToken(token);
        if (apartmentSharing != null) {
            return apartmentSharing.getTenantApartmentSharing();
        }

        return null;
    }

    public Tenant findTenantFileFromTokenPublic(String token) {
        ApartmentSharing apartmentSharing = apartmentSharingRepository.findOneByTokenPublic(token);
        if (apartmentSharing != null) {
            return apartmentSharing.getTenantApartmentSharing();
        }

        return null;
    }


    public TenantDTO getTenantLogged() {
        Tenant tenant = displayTenantAccount();
        return new TenantDTO(tenant);
    }

    public boolean modifyAccount(TenantDTO tenantDTO) {
        Tenant tenant = tenantRepository.findOne(tenantDTO.getId());
        tenant.setFirstName(tenantDTO.getFirstName());
        tenant.setLastName(tenantDTO.getLastName());
        tenant.setSalary(tenantDTO.getSalary());
        tenant.setTenantSituation(TenantSituation.values()[tenantDTO.getSituation()]);
        if (tenantDTO.getGuarantor() != null) {
            tenant.getGuarantor().setFirstName(tenantDTO.getGuarantor().getFirstName());
            tenant.getGuarantor().setLastName(tenantDTO.getGuarantor().getLastName());
        }


        String tenantFolder = File.separator + tenant.getUpload1().split("/")[2];

        if (!createFiles(tenant, tenantDTO, tenantFolder, 0)) {
            return false;
        }
        tenantRepository.save(tenant);
        return true;
    }

    public Boolean isValidated(String email) {
        Tenant tenant = tenantRepository.findOneByEmail(email);
        return tenant != null && tenant.getTenantFileStatus() == TenantFileStatus.VALIDATED;
    }

    public ApartmentSharing getApartmentSharing(Tenant tenant) {
        ApartmentSharing apartmentSharing = null;
        if (tenant.getApartmentSharings().size() > 0) {
            apartmentSharing = tenant.getApartmentSharings().get(0);
        } else if (tenant.getJoinedApartmentSharings().size() > 0) {
            apartmentSharing = tenant.getJoinedApartmentSharings().get(0);
        }
        return apartmentSharing;
    }


    public Tenant find(int id) {
        return tenantRepository.findOne(id);
    }

    public Tenant save(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    public void sendCustomMail(int tenantId, List<Integer> checksTenant, List<Integer> checksGuarantor, String textarea1, String textarea2) {
        Tenant tenant = find(tenantId);
        String mailMessage = messageSource.getMessage("bo.tenant.custom.email.head1", null, locale) + "<br/><br/>" + messageSource.getMessage("bo.tenant.custom.email.head2", null, locale) + "<br/> <ul>";

        mailMessage = sendCustomEmailBody(checksTenant, mailMessage, textarea1);
        if (checksGuarantor != null) {
            mailMessage += messageSource.getMessage(myMap.get(checksGuarantor.get(0)), null, locale) + "<ul>";
            checksGuarantor.remove(0);
        }
        mailMessage = sendCustomEmailBody(checksGuarantor, mailMessage, textarea2);

        mailMessage += "</ul><br/>" + messageSource.getMessage("bo.tenant.custom.email.footer1", null, locale) +
                "<br/><br/>" + messageSource.getMessage("bo.tenant.custom.email.footer2", null, locale) +
                "<br/><br/>" + messageSource.getMessage("bo.tenant.custom.email.footer3", null, locale) +
                "<br/>" + messageSource.getMessage("bo.tenant.custom.email.footer4", null, locale);

        String mailTitle = "Locatio - finalisation de votre dossier";

        mailService.sendAsyncMail(emailFrom, tenant.getEmail(), emailBcc, emailFrom, mailTitle, mailMessage);

    }

    public String sendCustomEmailBody(List<Integer> checks, String mailMessage, String textarea) {
        if (checks != null) {
            for (int check : checks) {
                mailMessage += "<li>" + messageSource.getMessage(myMap.get(check), null, locale) + "</li>";
            }
        }
        if (textarea != "") {
            mailMessage += "<li>" + textarea + "</li>";
        }
        mailMessage += "</ul>";
        return mailMessage;
    }

    public TenantDTO saveStep(TenantDTO tenantDTO, int step) {
        Tenant tenant;
        switch (step) {
            case 1:
                tenant = new Tenant(tenantDTO.getFirstName(), tenantDTO.getLastName());
                tenantRepository.save(tenant);
                tenantDTO.setId(tenant.getId());
                break;
            case 2:
                tenant = find(tenantDTO.getId());
                tenant.setEmail(tenantDTO.getEmail());
                tenant.setPartnerId(tenantDTO.getPartnerId());
                tenant.setPassword(bCryptPasswordEncoder.encode(tenantDTO.getPassword()));
                tenant.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
                UserRole userRole = new UserRole(tenant);
                userRoleRepository.save(userRole);
                statisticService.create(tenantDTO.getPartnerId());
                tenantRepository.save(tenant);
                break;
            case 4:
                tenant = find(tenantDTO.getId());
                tenant.setSalary(tenantDTO.getSalary());
                tenant.setTenantSituation(TenantSituation.values()[tenantDTO.getSituation()]);
                apartmentSharingService.createApartmentSharing(tenant, tenantDTO);
                tenantRepository.save(tenant);
                break;
            case 6:
                tenant = find(tenantDTO.getId());
                tenant.setGuarantor(new Guarantor(tenant));
                tenantRepository.save(tenant);
                break;
            case 7:
                tenant = find(tenantDTO.getId());
                tenant.getGuarantor().setFirstName(tenantDTO.getGuarantor().getFirstName());
                tenant.getGuarantor().setLastName(tenantDTO.getGuarantor().getLastName());
                tenantRepository.save(tenant);
                break;
        }


        return tenantDTO;
    }
}

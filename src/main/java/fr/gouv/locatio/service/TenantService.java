package fr.gouv.locatio.service;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.*;
import fr.gouv.locatio.repository.ApartmentSharingRepository;
import fr.gouv.locatio.model.Taxes;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.repository.UserRoleRepository;
import org.apache.tomcat.util.http.fileupload.FileUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.Method;
import java.util.List;

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
    private RestTemplate restTemplate;

    @Value("${particulier.api.gouv.fr}")
    private String apiURL;

    @Value("${particulier.api.gouv.fr.token}")
    private String apiToken;

    @Transactional
    public Boolean createAccount(TenantDTO tenantDTO) {
        Tenant tenant = new Tenant(tenantDTO);
        if (tenantDTO.getHasGuarantor()) {
            tenant.setGuarantor(this.getGuarantor(tenantDTO, tenant));
        }
        if (!createFiles(tenant, tenantDTO, "")) {
            return false;
        }
        tenantRepository.save(tenant);

        UserRole userRole = new UserRole(tenant);
        userRoleRepository.save(userRole);

        apartmentSharingService.createApartmentSharing(tenant, tenantDTO);

        userService.launchPasswordRecoveryProcedure(tenant.getEmail(), true);
        return true;
    }

    private Guarantor getGuarantor(TenantDTO tenantDTO, Tenant tenant) {
        Guarantor guarantor = new Guarantor();
        guarantor.setFirstName(tenantDTO.getGuarantor().getFirstName().trim().replaceAll("\\s+", " "));
        guarantor.setLastName(tenantDTO.getGuarantor().getLastName().trim().replaceAll("\\s+", " "));
        guarantor.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
        guarantor.setTenant(tenant);
        return guarantor;
    }

    private boolean createFiles(Tenant tenant, TenantDTO tenantDTO, String folderName) {
        String uploadRootPath = configurationService.getUploads();
        if (folderName.equals("")) {
            folderName = (File.separator + tenant.getLastName() + String.valueOf(System.nanoTime())).replaceAll("\\s+", "_");
        }

        uploadRootPath += folderName;

        File uploadRootDir = new File(uploadRootPath);
        if (!uploadRootDir.exists()) {
            uploadRootDir.mkdirs();
        }
        MultipartFile[] filesData = tenantDTO.getFiles();
        for (int i = 0; i < filesData.length & i < 5; i++) {
            this.UploadFilesForTenantAndGuarantor(filesData[i], true, uploadRootDir, folderName, tenant, i);
        }
        if (tenantDTO.getGuarantor() != null) {
            MultipartFile[] filesGuarantor = tenantDTO.getGuarantor().getQuarantorFiles();
            for (int i = 0; i < filesGuarantor.length & i < 5; i++) {
                this.UploadFilesForTenantAndGuarantor(filesGuarantor[i], false, uploadRootDir, folderName, tenant, i);
            }
        }

        return true;

    }


    private boolean UploadFilesForTenantAndGuarantor(MultipartFile multipartFile, boolean isTenant, File uploadRootDir, String folderName, Tenant tenant, int i) {
        String name = multipartFile.getName();
        String originalName = multipartFile.getOriginalFilename();
        if (originalName != null && originalName.length() > 0) {
            try {
                String[] ext = multipartFile.getOriginalFilename().split("\\.");
                name = name + String.valueOf(System.nanoTime()) + "." + ext[ext.length - 1];
                File serverFile = new File(uploadRootDir.getAbsolutePath() + File.separator + name);
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                stream.write(multipartFile.getBytes());
                stream.close();
                String filePath = "/tenants_files" + folderName + File.separator + name;

                Method methodGet;
                String UploadX;
                if (isTenant) {
                    methodGet = Tenant.class.getDeclaredMethod("getUpload" + (i + 1));
                    UploadX = (String) methodGet.invoke(tenant);
                } else {
                    methodGet = Guarantor.class.getDeclaredMethod("getUpload" + (i + 1));
                    UploadX = (String) methodGet.invoke(tenant.getGuarantor());

                }
                if (UploadX != null && !UploadX.isEmpty()) {
                    serverFile = new File(configurationService.getUploads() + UploadX.substring(14, UploadX.length()));
                    serverFile.delete();
                }
                Method methodSet;
                if (isTenant) {
                    methodSet = Tenant.class.getDeclaredMethod("setUpload" + (i + 1), String.class);
                    methodSet.invoke(tenant, filePath);
                } else {
                    methodSet = Guarantor.class.getDeclaredMethod("setUpload" + (i + 1), String.class);
                    methodSet.invoke(tenant.getGuarantor(), filePath);
                }

                System.out.println("Write file: " + serverFile);
            } catch (Exception e) {
                System.out.println("Error Write file: " + folderName + "/" + name);
                return false;
            }
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

        if (!createFiles(tenant, tenantDTO, tenantFolder)) {
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
}

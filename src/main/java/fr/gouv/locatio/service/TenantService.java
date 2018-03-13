package fr.gouv.locatio.service;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.TenantFileStatus;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.entity.UserRole;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.repository.UserRoleRepository;
import fr.gouv.locatio.security.Role;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private ConfigurationService configurationService;

    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @Transactional
    public Boolean createAccount(TenantDTO tenantDTO, Model model) {
        User user = new User();
        user.setEmail(tenantDTO.getEmail());
        user.setFirstName(tenantDTO.getFirstName());
        user.setLastName(tenantDTO.getLastName());
        user.setCreationDateTime(new LocalDateTime());
        userRepository.save(user);
        UserRole userRole = new UserRole();
        userRole.setRole(Role.ROLE_TENANT);
        userRole.setUser(user);
        userRoleRepository.save(userRole);
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(userRole);
        user.setUserRoles(userRoles);

        Tenant tenant = new Tenant();
        tenant.setUser(user);
        tenant.setTenantFileStatus(TenantFileStatus.TO_PROCESS);
        tenant.setEmailsList(tenantDTO.getEmailsList());

        String uploadRootPath = configurationService.getUploads();
        String folderName = File.separator + user.getLastName() + String.valueOf(System.currentTimeMillis());

        uploadRootPath += folderName;

        File uploadRootDir = new File(uploadRootPath);
        if (!uploadRootDir.exists()) {
            uploadRootDir.mkdirs();
        }
        MultipartFile[] filesData = tenantDTO.getFiles();
        List<File> uploadedFiles = new ArrayList<>();
        List<String> failedFiles = new ArrayList<>();
        for (int i = 0; i < filesData.length & i < 4; i++) {
            String name = filesData[i].getName();
            if (name != null && name.length() > 0) {
                try {
                    name = name + String.valueOf(System.currentTimeMillis()) + "." + filesData[i].getOriginalFilename().split("\\.")[1];
                    File serverFile = new File(uploadRootDir.getAbsolutePath() + File.separator + name);
                    BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                    stream.write(filesData[i].getBytes());
                    stream.close();
                    uploadedFiles.add(serverFile);
                    String filePath = "/tenants_files" + folderName + File.separator + name;
                    switch (i) {
                        case 0:
                            tenant.setUpload1(filePath);
                            break;
                        case 1:
                            tenant.setUpload2(filePath);
                            break;
                        case 2:
                            tenant.setUpload3(filePath);
                            break;
                        case 3:
                            tenant.setUpload4(filePath);
                            break;
                    }
                    System.out.println("Write file: " + serverFile);
                } catch (Exception e) {
                    System.out.println("Error Write file: " + folderName + "/" + name);
                    failedFiles.add(folderName + "/" + name);
                    return false;
                }
            }
        }
        tenantRepository.save(tenant);
        model.addAttribute("uploadedFiles", uploadedFiles);
        model.addAttribute("failedFiles", failedFiles);
        model.addAttribute("tenant", tenantDTO);
        userService.launchPasswordRecoveryProcedure(user.getEmail(), true);
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

            FileUtils.deleteDirectory(tenantFolder);
        }
    }

    public Tenant displayAccount() {
        User user = userService.getLoggedUser();
        if (null != user) {
            return tenantRepository.findByUser(user);
        }
        return null;
    }

    @Transactional
    public void validateTenantFile(Integer tenantId) {
        Tenant tenant = tenantRepository.findOne(tenantId);
        if (null != tenant) {
            tenant.setTenantFileStatus(TenantFileStatus.VALIDATED);
            tenant.setToken(RandomStringUtils.randomAlphabetic(80));
            String mailTitle = "Votre dossier a été validé";
            String mailMessage = "Bonjour,<br/><br/>Nous avons effectué une série de tests et nous n'avons pas détecté d'anomalie dans votre dossier&nbsp;!<br/><br/>Pour rassurer votre (futur) propriétaire et augmenter vos chances d'obtenir une visite, rendez-vous sur votre compte locatio pour générer le lien unique pointant vers les pièces de votre dossier.<br/><br/>Une fois ce lien généré, il vous suffira simplement de le transmettre aux propriétaires par mail, sms ou via les messageries des sites d'annonces. Une prise de contact contenant un lien locatio a 25% de chances supplémentaires d'obtenir une visite.<br/><br/><a href=\"https://locatio.beta.gouv.fr/locataire/mon-compte\">https://locatio.beta.gouv.fr/locataire/mon-compte</a><br/><br/>Si vous avez une question ou un doute, n'hésitez pas à nous contacter à contact@locatio.beta.gouv.fr<br/><br/>Toute l'équipe de Locatio vous souhaite bonne chance pour votre recherche&nbsp;!";
            mailService.sendAsyncMail("contact@locatio.beta.gouv.fr", tenant.getUser().getEmail(), "contact@locatio.beta.gouv.fr", mailTitle, mailMessage);
        }
    }

    public Tenant findTenantFileFromToken(String token) {
        Tenant tenant = tenantRepository.findByToken(token);
        if(tenant != null){
            return tenant;
        }

        return null;
    }
}

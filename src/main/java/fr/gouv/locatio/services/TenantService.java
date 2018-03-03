package fr.gouv.locatio.services;

import fr.gouv.locatio.dtos.TenantDTO;
import fr.gouv.locatio.entities.Tenant;
import fr.gouv.locatio.repositories.TenantRepository;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ConfigurationService configurationService;

    public Boolean saveAndUpload(TenantDTO tenantDTO, HttpServletRequest request, Model model) {
        Tenant tenant = new Tenant();
        tenant.setEmail(tenantDTO.getEmail());
        tenant.setName(tenantDTO.getName());
        tenant.setLastName(tenantDTO.getLastName());
        tenant.setEmailsList(tenantDTO.getEmailsList());
        tenant.setCreationDateTime(new LocalDateTime());

        String uploadRootPath = configurationService.getUploads();
        String folderName = File.separator + tenant.getName()+ String.valueOf(System.currentTimeMillis()) ;

        uploadRootPath+=folderName;

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
                    File serverFile = new File(uploadRootDir.getAbsolutePath()  + File.separator + name);
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
        return true;
    }

    public List<Tenant> listTenants() {
        return (List<Tenant>) tenantRepository.findAll();
    }

    public void deleteTenant(Integer tenantId) throws IOException {
        Tenant tenant = tenantRepository.findOne(tenantId);
        tenantRepository.delete(tenant);
        File serverFile = new File(configurationService.getUploads() + tenant.getUpload1());
        File tenantFolder = serverFile.getParentFile();
        FileUtils.deleteDirectory(tenantFolder);
    }
}

package fr.gouv.locatio.controller;

import fr.gouv.locatio.service.ConfigurationService;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Controller
public class FileController {

    @Autowired
    private ConfigurationService configurationService;

    @GetMapping("/tenants_files/{folderName}/{fileName:.+}")
    public void getImageAsByteArray(HttpServletResponse response, @PathVariable String folderName, @PathVariable String fileName) throws IOException {
        String absolutePath = configurationService.getUploads() + File.separator + folderName + File.separator + fileName;
        InputStream in = new FileInputStream(new File(absolutePath));
        if (fileName.endsWith(".pdf")) {
            response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        } else {
            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        }
        IOUtils.copy(in, response.getOutputStream());
    }
}

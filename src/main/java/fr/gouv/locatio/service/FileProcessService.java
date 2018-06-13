package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.file.process.File4Process;
import fr.gouv.locatio.service.file.process.File5Process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;


@Service
public class FileProcessService {
    @Value("${locatio.uploads}")
    private String locatioUploads;

    @Autowired
    private File4Process file4Process;
    @Autowired
    private File5Process file5Process;

    public HashMap processFiles(Tenant tenant) throws IOException {
        HashMap map = new HashMap();
        map.put("file4",file4Process.processFile4(tenant));
        map.put("file5",file5Process.processFile5(tenant));
        return map;
    }











}

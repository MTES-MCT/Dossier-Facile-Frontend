package fr.gouv.locatio.service;

import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.FileProcess.File4Process;
import fr.gouv.locatio.service.FileProcess.File5Process;
import fr.gouv.locatio.service.FileProcess.FileUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;



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

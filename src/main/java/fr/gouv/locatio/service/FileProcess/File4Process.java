package fr.gouv.locatio.service.FileProcess;

import fr.gouv.locatio.entity.Tenant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;

@Service
public class File4Process {
    @Value("${locatio.uploads}")
    private String locatioUploads;

    public HashMap processFile4(Tenant tenant) throws IOException {
        String path = locatioUploads + tenant.getUpload4().replace("/tenants_files", "");
        HashMap map = new HashMap();
        String result = FileUtils.extractTextPDF(path);
        boolean test1 = test1(result, tenant);
        boolean test2 = test2(result, tenant);
        if (!test1 || !test2) {
            String imagePage1 = FileUtils.convertPDFToImage(path)[0];
            result = FileUtils.imageOCR(imagePage1);
        }
        if (!test1) {
            test1 = test1(result, tenant);
        }
        if (!test2) {
            test2 = test2(result, tenant);
        }

        map.put("test1", test1);
        map.put("test2", test2);
        return map;
    }

    //check if the name is OK
    public boolean test1(String result, Tenant tenant) throws IOException {
        return FileUtils.containsName(result, tenant);
    }


    //check if the amount "montant fiscal de référence" is equals to 12*salary with an acceptable error of 10% (value in parameter)
    public boolean test2(String result, Tenant tenant) throws IOException {
        int referenceTax = extractReferenceTax(result);
        int salaryFile = referenceTax / 12;
        int salaryDeclared = tenant.getSalary();
        double errorPercent = salaryDeclared * 0.1;
        if (salaryDeclared - errorPercent < salaryFile && salaryFile < salaryDeclared + errorPercent) {
            return true;
        } else {
            return false;
        }
    }

    //the other test is the one for which we need the token
    public boolean test3(){
        return false;
    }




    private int extractReferenceTax(String result) {
        int money = 0;
        String lines[] = result.split("\\r?\\n");
        for (String line : lines) {
            if (line.contains("Revenu fiscal")) {
                money = Integer.valueOf(line.substring(line.indexOf(':') + 1, line.length()).replaceAll(" ", ""));
                break;
            }
        }
        return money;
    }
}



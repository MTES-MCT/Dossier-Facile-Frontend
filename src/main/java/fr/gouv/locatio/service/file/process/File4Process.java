package fr.gouv.locatio.service.file.process;

import fr.gouv.locatio.entity.Tenant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@Service
public class File4Process {
    @Value("${locatio.uploads}")
    private String locatioUploads;

    public HashMap processFile4(Tenant tenant){
        String path = locatioUploads + tenant.getUpload4().replace("/tenants_files", "");
        HashMap map = new HashMap();
        String result = FileUtilsLocatio.extractTextPDF(path);
        boolean test1 = test1(result, tenant);
        boolean test2 = test2(result, tenant);
        if (!test1 || !test2) {
            String imagePage1 = FileUtilsLocatio.convertPDFToImage(path)[0];
            result = FileUtilsLocatio.imageOCR(imagePage1);
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
    public boolean test1(String result, Tenant tenant) {
        return FileUtilsLocatio.containsName(result, tenant);
    }


    //check if the amount "montant fiscal de référence" is equals to 12*salary with an acceptable error of 10% (value in parameter)
    public boolean test2(String result, Tenant tenant) {
        HashMap<String, Integer> referenceTaxs = FileUtilsLocatio.extractNumbersText(result);
        int salaryDeclared = tenant.getSalary();
        for (Map.Entry<String, Integer> entry : referenceTaxs.entrySet()) {
            int value = entry.getValue();
            String key = entry.getKey();
            if (value > 1 && key.length() < 8) {
                double salaryFile;
                try {
                    salaryFile = Double.valueOf(key) / 12;
                } catch (NumberFormatException e) {
                    salaryFile = 0;
                }
                double errorPercent = salaryDeclared * 0.1;
                if (salaryDeclared - errorPercent < salaryFile && salaryFile < salaryDeclared + errorPercent) {
                    return true;
                }
            }
        }
        return false;

    }

    //the other test is the one for which we need the token
    public boolean test3() {
        return false;
    }


    private HashMap<String, Integer> extractReferenceTax(String result) {
        HashMap<String, Integer> numbers = new HashMap();
        String lines[] = result.split("\\r?\\n");
        for (String line : lines) {
            line = line.replaceAll("[^0-9\\,]+", "");
            if (line.length() != 0) {
                if (numbers.get(line) != null) {
                    numbers.put(line, numbers.get(line) + 1);
                } else {
                    numbers.put(line, 1);
                }
            }

        }
        return numbers;
    }
}



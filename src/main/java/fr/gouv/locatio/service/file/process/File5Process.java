package fr.gouv.locatio.service.file.process;

import fr.gouv.locatio.entity.Tenant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service

public class File5Process {
    @Value("${locatio.uploads}")
    private String locatioUploads;


    public HashMap processFile5(Tenant tenant){
        String path = locatioUploads + tenant.getUpload5().replace("/tenants_files", "");
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
    private boolean test1(String result, Tenant tenant) {
        return FileUtilsLocatio.containsName(result, tenant);
    }

    //salary in the file is coherent with salary in the form (10% error)
    private boolean test2(String result, Tenant tenant) {
        int positiveResult = 0;
        HashMap<String,Integer> money = FileUtilsLocatio.extractNumbersText(result);
        for (Map.Entry<String, Integer> entry : money.entrySet()) {
            int value = entry.getValue();
            String key = entry.getKey();
            double salaryFile = 0;
            try {
                salaryFile = Double.valueOf(key);
            } catch (NumberFormatException e) {
                salaryFile = 0;
            }
            int salaryDeclared = tenant.getSalary();
            double errorPercent = salaryDeclared * 0.1;
            if (salaryDeclared - errorPercent < salaryFile && salaryFile < salaryDeclared + errorPercent) {
                positiveResult+=value;
            }
        }
       return positiveResult>0;
    }


    private HashMap<String,Integer> extractSalaryByMonth(String result) {
        HashMap<String, Integer> numbers = new HashMap();
        String lines[] = result.split("\\r?\\n");
        for (String line : lines) {
            line = line.replaceAll("\\D+", "");
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


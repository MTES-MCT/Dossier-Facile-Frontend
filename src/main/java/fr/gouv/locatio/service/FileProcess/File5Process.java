package fr.gouv.locatio.service.FileProcess;

import fr.gouv.locatio.entity.Tenant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;

@Service

public class File5Process {
    @Value("${locatio.uploads}")
    private String locatioUploads;


    public HashMap processFile5(Tenant tenant) throws IOException {
        String path = locatioUploads + tenant.getUpload5().replace("/tenants_files", "");
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
    private boolean test1(String result, Tenant tenant) {
        return FileUtils.containsName(result, tenant);
    }

    //salary in the file is coherent with salary in the form (10% error)
    private boolean test2(String result, Tenant tenant) {
        double[] money = extractSalaryByMonth(result);
        for (int i = 0; i < money.length; i++) {
            if (money[i]==0){
                break;
            }
            double salaryFile = money[i];
            int salaryDeclared = tenant.getSalary();
            double errorPercent = salaryDeclared * 0.1;
            if (salaryDeclared - errorPercent > salaryFile || salaryFile > salaryDeclared + errorPercent) {
                return false;
            }
        }
        return true;
    }


    private double[] extractSalaryByMonth(String result) {
        double money[] = new double[12];
        int i = 0;
        String lines[] = result.split("\\r?\\n");
        for (String line : lines) {
            if (line.contains("NET A PAYER") && line.length() > 11) {
                money[i] = Double.valueOf(line.substring(12, line.length()));
                i++;
            }
        }
        return money;
    }
}


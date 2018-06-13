package fr.gouv.locatio.controller;


import fr.gouv.locatio.dto.GuarantorDTO;
import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.StatisticService;
import fr.gouv.locatio.service.TenantService;
import fr.gouv.locatio.validator.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.File;

@Controller
@RequestMapping(value = "/registerTenant")

public class RegisterTenantController {
    @Autowired
    private TenantService tenantService;
    @Autowired
    private StatisticService statisticService;

    //show form firstname and lastname tenant
    @GetMapping("/step1")
    public String step1Form(Model model) {
        TenantDTO tenantDTO = new TenantDTO();
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step1";
    }

    //process form firtname and lastname tenant
    @PostMapping("/step1")
    public String step1FormProcess(Model model, @Validated(Step1.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "registerTenant/step1";
        }
        tenantDTO = tenantService.saveStep(tenantDTO, 1);
        model.addAttribute("tenantDTO", tenantDTO);
        return "redirect:/registerTenant/step2/" + tenantDTO.getId();
    }

    //show form email and password tenant
    @GetMapping("/step2/{id}")
    public String step2Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step2";
    }

    //process form email and password tenant
    @PostMapping("/step2/{id}")
    public String step2FormProcess(Model model, @Validated(Step2.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result, HttpSession session) {
        if (result.hasErrors()) {
            return "registerTenant/step2";
        }

        String utmSource = (String) session.getAttribute("utm_source");
        if (utmSource!=null){
            tenantDTO.setPartnerId(utmSource);
            session.removeAttribute("utm_source");
        }else{
            tenantDTO.setPartnerId("locatio");
        }
        tenantDTO = tenantService.saveStep(tenantDTO, 2);
        model.addAttribute("tenantDTO", tenantDTO);
        return "redirect:/registerTenant/step3/" + tenantDTO.getId();
    }

    //show form select type alone, create or join apartment sharing
    @GetMapping("/step3/{id}")
    public String step3Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        tenantDTO.setTenantType("alone");
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step3";
    }

    //process form select type alone, create or join apartment sharing
    @PostMapping("/step3/{id}")
    public String step3FormProcess(Model model, @Validated(Step3.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "registerTenant/step3";
        }
        model.addAttribute("tenantDTO", tenantDTO);
        return "redirect:/registerTenant/step4/" + tenantDTO.getId() + "/" + tenantDTO.getTenantType();
    }

    /*
    * show form alone situation and salary
    * or show form create situation, salary and number of tenants
    * or show form join situation, salary and mail of tenant
    */
    @GetMapping("/step4/{id}/{tenantType}")
    public String step4Form(Model model, @PathVariable("id") int id, @PathVariable("tenantType") String tenantType) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        tenantDTO.setTenantType(tenantType);
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step4";
    }

    //process form in case alone
    @PostMapping("/step4/{id}/alone")
    public String step4FormProcessAlone(@Validated(TenantAlone.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        tenantDTO.setTenantType("alone");
        return step4FormProcess(tenantDTO, result);
    }

    //process form in case create
    @PostMapping("/step4/{id}/create")
    public String step4FormProcessCreate(@Validated(TenantCreateApartmentSharing.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        tenantDTO.setTenantType("create");
        return step4FormProcess(tenantDTO, result);
    }

    //process form in case join
    @PostMapping("/step4/{id}/join")
    public String step4FormProcessJoin(@Validated(TenantJoinApartmentSharing.class) @ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        tenantDTO.setTenantType("join");
        return step4FormProcess(tenantDTO, result);
    }

    //process form step4
    public String step4FormProcess(TenantDTO tenantDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "registerTenant/step4";
        }
        tenantDTO = tenantService.saveStep(tenantDTO, 4);
        return "redirect:/registerTenant/step5/" + tenantDTO.getId();
    }

    //show form to upload file1-file5 tenant
    @GetMapping("/step5/{id}")
    public String step5Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        model.addAttribute("tenantDTO", tenantDTO);
        model.addAttribute("fileNumber", tenant.getFileNumber());
        return "registerTenant/step5";
    }

    //process form to upload file1-file5 tenant
    @PostMapping("/step5/{id}")
    public String step5FormProcess(@ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result, @RequestParam(value = "fileNumber") int fileNumber) {
        if (result.hasErrors()) {
            return "registerTenant/step5";
        }
        Tenant tenant = tenantService.find(tenantDTO.getId());
        boolean error;
        if (fileNumber != 1) {
            String tenantFolder = File.separator + tenant.getUpload1().split("/")[2];
            error = tenantService.createFiles(tenant, tenantDTO, tenantFolder, fileNumber);
        } else {
            error = tenantService.createFiles(tenant, tenantDTO, "", fileNumber);
        }
        if (!error) {
            return "redirect:/error";
        }
        tenantService.save(tenant);
        if (tenant.getUpload5() != null) {
            return "redirect:/registerTenant/step6/" + tenantDTO.getId();
        }
        return "redirect:/registerTenant/step5/" + tenantDTO.getId();
    }

    //show form has guarantor
    @GetMapping("/step6/{id}")
    public String step6Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step6";
    }

    //process form has guarantor
    @PostMapping("/step6/{id}")
    public String step6FormProcess(@ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "registerTenant/step6";
        }
        if (!tenantDTO.getHasGuarantor()){
            return "redirect:/compte-cree";
        }
        tenantDTO = tenantService.saveStep(tenantDTO, 6);
        return "redirect:/registerTenant/step7/" + tenantDTO.getId();
    }

    //show form firtname and lastname guarantor
    @GetMapping("/step7/{id}")
    public String step7Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        tenantDTO.setGuarantor(new GuarantorDTO());
        model.addAttribute("tenantDTO", tenantDTO);
        return "registerTenant/step7";
    }

    //process form firstname and lastname guarantor
    @PostMapping("/step7/{id}")
    public String step7FormProcess(@ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result) {
        if (result.hasErrors()) {
            return "registerTenant/step7";
        }
        tenantDTO = tenantService.saveStep(tenantDTO, 7);
        return "redirect:/registerTenant/step8/" + tenantDTO.getId();
    }

    @GetMapping("/step8/{id}")
    public String step8Form(Model model, @PathVariable("id") int id) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        tenantDTO.setGuarantor(new GuarantorDTO());
        model.addAttribute("tenantDTO", tenantDTO);
        model.addAttribute("fileNumber", tenant.getGuarantor() != null ? tenant.getGuarantor().getFileNumber() : 1);
        return "registerTenant/step8";
    }

    @PostMapping("/step8/{id}")
    public String step8FormProcess(@ModelAttribute("tenantDTO") TenantDTO tenantDTO, BindingResult result, @RequestParam(value = "fileNumber") int fileNumber) {
        if (result.hasErrors()) {
            return "registerTenant/step8";
        }

        Tenant tenant = tenantService.find(tenantDTO.getId());

        String tenantFolder = File.separator + tenant.getUpload1().split("/")[2];
        boolean error = tenantService.createFiles(tenant, tenantDTO, tenantFolder, fileNumber);

        if (!error) {
            return "redirect:/error";
        }
        tenantService.save(tenant);
        if (tenant.getGuarantor().getUpload5() != null) {
            return "redirect:/compte-cree";
        }
        return "redirect:/registerTenant/step8/" + tenantDTO.getId();
    }
}

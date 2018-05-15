package fr.gouv.locatio.controller;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.FileProcessService;
import fr.gouv.locatio.service.TenantService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;
import java.io.IOException;


@Controller
@RequestMapping(value = "/bo/tenant")
public class BOTenantController {
    @Autowired
    TenantService tenantService;
    @Autowired
    FileProcessService fileProcessService;

    @GetMapping("/{id}/processFiles")
    public String processFiles(Model model, @PathVariable("id") int id) throws IOException {
        Tenant tenant = tenantService.find(id);
        model.addAttribute("files", fileProcessService.processFiles(tenant)).toString();
        return "bo-processed-files";
    }

    @PostMapping("/{id}/validate")
    public String validateTenantFile(@PathVariable("id") int id, String redirectURL) throws IOException {
        tenantService.validateTenantFile(id);
        return "redirect:" + redirectURL;
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable("id") int id, Model model) {
        Tenant tenant = tenantService.find(id);
        TenantDTO tenantDTO = new TenantDTO(tenant);
        model.addAttribute("tenant", tenantDTO);
        model.addAttribute("tenantEntity", tenant);
        model.addAttribute("apartmentSharing",tenantService.getApartmentSharing(tenant));
        return "bo-tenant-form";
    }

    @PostMapping("/{id}/edit")
    public String edit(Model model, @PathVariable("id") int id, @Valid TenantDTO tenantDTO, BindingResult result, String redirectURL) {
        if (result.hasErrors()) {
            Tenant tenant = tenantService.find(id);
            model.addAttribute("tenant", tenantDTO);
            model.addAttribute("tenantEntity", tenant);
            return "bo-tenant-form";
        }
        tenantService.modifyAccount(tenantDTO);
        return "redirect:" + redirectURL;
    }
}

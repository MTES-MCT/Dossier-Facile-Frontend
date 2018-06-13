package fr.gouv.locatio.controller;

import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.FileProcessService;
import fr.gouv.locatio.service.MailService;
import fr.gouv.locatio.service.TenantService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.util.*;


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
        model.addAttribute("apartmentSharing", tenantService.getApartmentSharing(tenant));
        return "bo-tenant-form";
    }

    @PostMapping("/{id}/edit")
    public String edit(Model model, @PathVariable("id") int id, @Valid TenantDTO tenantDTO, BindingResult result, String redirectURL) {
        if (result.hasErrors()) {
            Tenant tenant = tenantService.find(id);
            model.addAttribute("tenant", tenantDTO);
            model.addAttribute("tenantEntity", tenant);
            model.addAttribute("apartmentSharing", tenantService.getApartmentSharing(tenant));
            return "bo-tenant-form";
        }
        tenantService.modifyAccount(tenantDTO);
        return "redirect:" + redirectURL;
    }

    @GetMapping("/{appartment_sharing_id}/{tenant_id}/customEmail")
    public String customEmailForm(@PathVariable("appartment_sharing_id") int appartmentSharingId, @PathVariable("tenant_id") int tenantId, Model model) {
        Tenant tenant = tenantService.find(tenantId);
        model.addAttribute("tenant", tenant);
        model.addAttribute("appartment_sharing_id", appartmentSharingId);
        return "bo-tenant-custom-email-form";
    }

    @PostMapping("/{appartment_sharing_id}/{tenant_id}/customEmail")
    public String customEmail(@PathVariable("appartment_sharing_id") int appartmentSharingId,
                              @PathVariable("tenant_id") int tenantId,
                              @RequestParam(value = "checksTenant", required = false) List<Integer> checksTenant,
                              @RequestParam(value = "checksGuarantor", required = false) List<Integer> checksGuarantor,
                              @RequestParam(value = "textarea1", required = false) String textarea1,
                              @RequestParam(value = "textarea2", required = false) String textarea2) throws MessagingException {
     tenantService.sendCustomMail(tenantId, checksTenant, checksGuarantor, textarea1, textarea2);


        return "redirect:/bo/colocation/" + appartmentSharingId;
    }
}

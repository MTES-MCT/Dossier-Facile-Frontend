package fr.gouv.locatio.controller;

import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.GuarantorService;
import fr.gouv.locatio.service.OwnerService;
import fr.gouv.locatio.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.util.List;

@Controller
public class BOController {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private GuarantorService guarantorService;

    @GetMapping("/bo")
    public String bo(Model model) {
        return "bo";
    }

    @GetMapping("/bo/proprios")
    public String listOwners(Model model) {
        List<Owner> owners = ownerService.listSubscribedOwners();
        model.addAttribute("owners", owners);
        return "bo_proprios";
    }

    @PostMapping("/bo/deleteOwner")
    public String deleteOwner(Integer subscriptionId) {
        ownerService.deleteSubscribedOwner(subscriptionId);
        return "redirect:/bo/proprios";
    }

    @GetMapping("/bo/locataires")
    public String listTenants(Model model) {
        List<Tenant> tenants = tenantService.listTenants();
        model.addAttribute("tenants",tenants);
        return "bo_locataires";
    }

    @PostMapping("/bo/validateTenantFile")
    public String validateTenantFile(Integer tenantId) throws IOException {
        tenantService.validateTenantFile(tenantId);
        return "redirect:/bo/locataires";
    }

    @PostMapping("/bo/deleteTenant")
    public String deleteTenant(Integer tenantId) throws IOException {
        tenantService.deleteTenant(tenantId);
        return "redirect:/bo/locataires";
    }

    @GetMapping("/stats")
     public String stats(){
        return "stats";
    }
    @GetMapping("/bo/guarantor/{id}")
    public String garantFiles(@PathVariable("id") Integer id, Model model){
         model.addAttribute("guarantor",guarantorService.getGuarantor(id));
         return "bo-guarantor";
    }
}

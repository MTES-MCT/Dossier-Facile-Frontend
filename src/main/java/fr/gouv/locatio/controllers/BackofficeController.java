package fr.gouv.locatio.controllers;

import fr.gouv.locatio.entities.Subscription;
import fr.gouv.locatio.entities.Tenant;
import fr.gouv.locatio.services.OwnerService;
import fr.gouv.locatio.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

@Controller
public class BackofficeController {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private OwnerService ownerService;

    @GetMapping("/bo")
    public String bo(Model model) {
        return "bo";
    }

    @GetMapping("/bo/proprios")
    public String listOwners(Model model) {
        List<Subscription> subscriptions = ownerService.listSubscribedOwners();
        model.addAttribute("subscriptions",subscriptions);
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

    @PostMapping("/bo/deleteTenant")
    public String deleteTenant(Integer tenantId) throws IOException {
        tenantService.deleteTenant(tenantId);
        return "redirect:/bo/locataires";
    }
}

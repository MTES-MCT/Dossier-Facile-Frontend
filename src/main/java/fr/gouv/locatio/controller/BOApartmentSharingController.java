package fr.gouv.locatio.controller;


import fr.gouv.locatio.entity.ApartmentSharing;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.service.ApartmentSharingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping(value = "/bo/colocation")
public class BOApartmentSharingController {

    @Autowired
    private ApartmentSharingService apartmentSharingService;

    @GetMapping("")
    public String index(Model model) {
        model.addAttribute("apartmentSharings", apartmentSharingService.findAll());
        return "bo-apartment-sharing";
    }

    @GetMapping("/{id}")
    public String view(Model model, @PathVariable("id") int id) {
        ApartmentSharing apartmentSharing = apartmentSharingService.find(id);
        model.addAttribute("apartmentSharing", apartmentSharing);
        List<Tenant> tenants = new ArrayList<>();
        tenants.add(apartmentSharing.getTenantApartmentSharing());
        tenants.addAll(apartmentSharing.getTenants());
        model.addAttribute("tenants", tenants);
        return "bo-apartment-sharing-view";
    }


    @PostMapping("/{id}/delete")
    public String delete(Model model, @PathVariable("id") int id) {
        apartmentSharingService.delete(id);
        return "redirect:/bo/colocation";
    }

}

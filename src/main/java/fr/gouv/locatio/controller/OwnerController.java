package fr.gouv.locatio.controller;

import fr.gouv.locatio.entity.*;
import fr.gouv.locatio.repository.OwnerRepository;
import fr.gouv.locatio.repository.UserRepository;
import fr.gouv.locatio.security.SubscriptionStatus;
import fr.gouv.locatio.service.ApartmentSharingService;
import fr.gouv.locatio.service.OwnerService;
import fr.gouv.locatio.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApartmentSharingService apartmentSharingService;

    @GetMapping("/info-proprietaire")
    public String infoProprietaire(Model model, @RequestParam(value = "token", required = false) String token) {
        Owner owner = new Owner();
        model.addAttribute("owner", owner);
        model.addAttribute("token", token);
        return "info-proprietaire";
    }

    @PostMapping("/subscription")
    public String registerSubscriptions(@Valid Owner owner, BindingResult result, @ModelAttribute("token") String token) {
        if (!result.hasErrors()) {
            ownerService.createOwnerAccount(owner, token);
            return "redirect:/home";
        }
        return "/info-proprietaire";
    }

    @GetMapping("/proprietaire/contacter/{token}")
    public String subcribeProprietaire(Model model, @PathVariable("token") String token, Principal principal) {
        model.addAttribute("token", token);
        Owner ownerToken = ownerRepository.findOneByToken(token);
        if (null == ownerToken) {
            return "redirect:/error";
        }
        model.addAttribute("status", ownerService.getStatusOwnerLink(principal.getName(), ownerToken));
        return "owner-subscriber";
    }

    @PostMapping("/proprietaire/owner-subscriber")
    public String ownerSubcriber(String token, Boolean access, Model model) {
        Tenant tenant = tenantService.displayTenantAccount();
        if (tenant == null) {
            return "redirect:/error";
        }
        SubscriptionStatus subscriptionStatus = ownerService.subscribeTenant(token, access, tenant);
        model.addAttribute("status", subscriptionStatus);
        return "subscription-result";
    }

    @GetMapping("/proprietaire/mon-compte")
    public String ownerProfile(Model model, Principal principal) {
        Owner owner = ownerRepository.findOneByEmail(principal.getName());
        model.addAttribute("owner", owner);

        Map<Integer, Integer> apartmentSharingTotalSalaries = new HashMap<>();
        for (OwnerApartmentSharing ownerApartmentSharing : owner.getOwnerApartmentSharings()) {
            apartmentSharingTotalSalaries.put(ownerApartmentSharing.getId(), apartmentSharingService.totalSalary(ownerApartmentSharing.getApartmentSharing()));
        }

        model.addAttribute("apartmentSharingTotalSalaries", apartmentSharingTotalSalaries);

        return "owner-profile";
    }
}

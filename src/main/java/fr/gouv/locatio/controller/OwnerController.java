package fr.gouv.locatio.controller;

import fr.gouv.locatio.entity.Subscription;
import fr.gouv.locatio.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;

@Controller
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @GetMapping("/info-proprietaire")
    public String infoProprietaire(Model model) {
        Subscription subscription = new Subscription();
        model.addAttribute("subscription", subscription);
        return "info-proprietaire";
    }


    @PostMapping("/subscription")
    public String registerSubscriptions(@Valid Subscription subscription, BindingResult result, WebRequest request, Errors errors, Model model) {
        if (!result.hasErrors()) {
            ownerService.saveSubscription(subscription);
            return "redirect:/home";
        }

        return "/info-proprietaire";
    }


}

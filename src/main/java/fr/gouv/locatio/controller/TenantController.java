package fr.gouv.locatio.controller;

import fr.gouv.locatio.displayer.UserDisplayer;
import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.entity.User;
import fr.gouv.locatio.service.TenantService;
import fr.gouv.locatio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;

@Controller
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private UserService userService;

    @GetMapping("/locataire")
    public String getLocataire(Model model) {
        UserDisplayer userDisplayer = userService.createConnectedUserDisplayer();
        model.addAttribute("displayer", userDisplayer);
        return "info-locataire";
    }

    @GetMapping("/creer-compte")
    public String envoyerDossier(Model model) {
        TenantDTO tenantDTO = new TenantDTO();
        model.addAttribute("tenant", tenantDTO);
        return "envoyer-dossier";
    }

    @PostMapping("/info-locataire")
    @ResponseBody
    public ResponseEntity<?> registerTenant(@Valid TenantDTO tenantDTO, BindingResult result, Model model) {
        if (!result.hasErrors()) {
            if (tenantService.createAccount(tenantDTO, model)) {
                return new ResponseEntity("Successfully uploaded!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        model.addAttribute("tenant", tenantDTO);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/locataire/mon-compte")
    public String displayTenantAccount(Model model) {
        Tenant tenant = tenantService.displayAccount();
        UserDisplayer displayer = userService.createConnectedUserDisplayer();
        if (null == tenant) {
            return "redirect:/error";
        }
        model.addAttribute("displayer", displayer);
        model.addAttribute("tenant", tenant);
        model.addAttribute("magicLink", false);
        return "mon-compte";
    }

    @GetMapping("/dossier-locataire/{token}")
    public String displayTenantFile(@PathVariable("token") String token, Model model) {
        Tenant tenant = tenantService.findTenantFileFromToken(token);
        if (null == tenant) {
            return "redirect:/error";
        }
        model.addAttribute("tenant", tenant);
        model.addAttribute("magicLink", true);
        return "mon-compte";
    }
}

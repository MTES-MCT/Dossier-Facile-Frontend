package fr.gouv.locatio.controllers;

import fr.gouv.locatio.dtos.TenantDTO;
import fr.gouv.locatio.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Controller
public class TenantController {

    @Autowired
    TenantService tenantService;

    @PostMapping("/info-locataire")
    @ResponseBody
    public ResponseEntity<?> registerTenant(@Valid TenantDTO tenantDTO,
                                            BindingResult result, HttpServletRequest request, Errors errors, Model model) {
        if (!result.hasErrors()) {
            if (tenantService.saveAndUpload(tenantDTO, request, model)) {

                return new ResponseEntity("Successfully uploaded!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

        }
        model.addAttribute("tenant", tenantDTO);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @GetMapping("/locataire")
    public String getLocataire(Model model) {
        return "info-locataire";
    }

    @GetMapping("/envoyer-dossier")
    public String envoyerDossier(Model model) {
        TenantDTO tenantDTO = new TenantDTO();
        model.addAttribute("tenant", tenantDTO);
        return "envoyer-dossier";
    }

}

package fr.gouv.locatio.controller;

import fr.gouv.locatio.dto.GuarantorDTO;
import fr.gouv.locatio.dto.TenantDTO;
import fr.gouv.locatio.entity.ApartmentSharing;
import fr.gouv.locatio.entity.Guarantor;
import fr.gouv.locatio.entity.Owner;
import fr.gouv.locatio.entity.Tenant;
import fr.gouv.locatio.repository.OwnerRepository;
import fr.gouv.locatio.repository.TenantRepository;
import fr.gouv.locatio.service.*;
import fr.gouv.locatio.validator.TenantAlone;
import fr.gouv.locatio.validator.TenantCreateApartmentSharing;
import fr.gouv.locatio.validator.TenantJoinApartmentSharing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private UserService userService;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private ApartmentSharingService apartmentSharingService;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private StatisticService statisticService;

    @GetMapping("/locataire")
    public String getLocataire(@RequestParam(required = false) String utm_source, HttpSession session) {
        if (utm_source != null) {
            session.setAttribute("utm_source", utm_source);
        }
        return "info-locataire";
    }

    @GetMapping("/locataire/new")
    public String envoyerDossier(Model model, @RequestParam(required = false) String apartmentSharing) {
        TenantDTO tenantDTO = new TenantDTO();
        String tenantType = "alone";
        if (apartmentSharing != null) {
            tenantType = apartmentSharing;
        }
        tenantDTO.setTenantType(tenantType);
        model.addAttribute("tenant", tenantDTO);
        return "tenant-form";
    }

    @GetMapping("/compte-cree")
    public String accountCreated(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession();
        String ownerToken = (String) session.getAttribute("ownerToken");
        String tenantId = (String) session.getAttribute("tenantId");

        if (null != ownerToken) {
            Owner owner = ownerRepository.findOneByToken(ownerToken);
            if (owner != null) {
                model.addAttribute("subscribe", true);
                model.addAttribute("token", ownerToken);
                model.addAttribute("tenantId", tenantId);
                session.removeAttribute("ownerToken");
                session.removeAttribute("tenantId");
                return "account-created";
            }

        }

        model.addAttribute("subscribe", false);
        return "account-created";
    }

    @PostMapping("/creer-compte/alone")
    public String createAccountAlone(@Validated(TenantAlone.class) @ModelAttribute("tenant") TenantDTO tenantDTO, BindingResult result, HttpSession session) {
        if (result.hasErrors()) {
            return "tenant-form";
        }
        String utmSource = (String) session.getAttribute("utm_source");
        if (utmSource!=null){
            session.removeAttribute("utm_source");
        }
        int tenantId = tenantService.createAccount(tenantDTO,utmSource);
        session.setAttribute("tenantId", String.valueOf(tenantId));
        return "redirect:/compte-cree";
    }

    @PostMapping("/creer-compte/create-colocation")
    public String createAccountOwnerApartmentSharing(@Validated(TenantCreateApartmentSharing.class) @ModelAttribute("tenant") TenantDTO tenantDTO, BindingResult result, HttpSession session) {
        if (result.hasErrors()) {
            return "tenant-form";
        }
        String utmSource = (String) session.getAttribute("utm_source");
        if (utmSource!=null){
            session.removeAttribute("utm_source");
        }
        int tenantId = tenantService.createAccount(tenantDTO,utmSource);
        session.setAttribute("tenantId", String.valueOf(tenantId));
        return "redirect:/compte-cree";
    }

    @PostMapping("/creer-compte/join-colocation")
    public String createAccountJoinApartmentSharing(Model model, @Validated(TenantJoinApartmentSharing.class) @ModelAttribute("tenant") TenantDTO tenantDTO, BindingResult result, HttpSession session) {
        if (result.hasErrors()) {
            return "tenant-form";
        }
        String utmSource = (String) session.getAttribute("utm_source");
        if (utmSource!=null){
            session.removeAttribute("utm_source");
        }
        tenantService.createAccount(tenantDTO,utmSource);
        return "redirect:/compte-cree";
    }


    @GetMapping("/locataire/mon-compte")
    public String displayTenantAccount(Model model, Principal principal) {
        Tenant tenant = tenantRepository.findOneByEmail(principal.getName());
        if (null == tenant) {
            return "redirect:/error";
        }

        ApartmentSharing apartmentSharing = null;
        if (tenant.getApartmentSharings().size() > 0) {
            apartmentSharing = tenant.getApartmentSharings().get(0);
        } else if (tenant.getJoinedApartmentSharings().size() > 0) {
            apartmentSharing = tenant.getJoinedApartmentSharings().get(0);
        }

        model.addAttribute("tenant", tenant);
        model.addAttribute("validApartmentSharing", apartmentSharingService.validateApartmentSharing(apartmentSharing));
        model.addAttribute("apartmentSharing", apartmentSharing);
        model.addAttribute("tenantOwnerApartmentSharing", apartmentSharing != null && apartmentSharing.getTenantApartmentSharing().getId().equals(tenant.getId()));
        return "mon-compte";
    }

    @GetMapping("/dossier-locataire/{token}")
    public String displayTenantFile(@PathVariable("token") String token, Model model, HttpServletRequest request, Principal principal) {
        ApartmentSharing apartmentSharing = apartmentSharingService.findApartmentSharingFromToken(token);
        if (null == apartmentSharing) {
            return "redirect:/error";
        }

        if (principal != null) {
            Owner owner = ownerRepository.findOneByEmail(principal.getName());
            if (owner != null) {
                ownerService.linkOwnerTenant(owner, token);
            }
        } else {
            request.getSession().setAttribute("token", token);
        }

        model.addAttribute("token", token);

        if (apartmentSharing.isForOneTenant()) {
            model.addAttribute("tenant", apartmentSharing.getTenantApartmentSharing());
            model.addAttribute("showFiles", true);
            return "visit-file";
        } else {
            List<Tenant> tenants = new ArrayList<>();
            tenants.add(apartmentSharing.getTenantApartmentSharing());
            tenants.addAll(apartmentSharing.getTenants());
            model.addAttribute("tenants", tenants);
            model.addAttribute("apartmentSharing", apartmentSharing);
            model.addAttribute("token", token);
            model.addAttribute("totalSalary", apartmentSharingService.totalSalary(apartmentSharing));
            return "visit-apartment-sharing-full";
        }

    }


    @GetMapping("/visite-locataire/{tokenPublic}")
    public String displayTenantInfoWithoutFile(@PathVariable("tokenPublic") String tokenPublic, Model model, HttpServletRequest request, Principal principal) {
        ApartmentSharing apartmentSharing = apartmentSharingService.findApartmentSharingFromTokenPublic(tokenPublic);
        if (null == apartmentSharing) {
            return "redirect:/error";
        }
        if (principal != null) {
            Owner owner = ownerRepository.findOneByEmail(principal.getName());
            if (owner != null) {
                ownerService.linkOwnerTenant(owner, tokenPublic);
            }
        } else {
            request.getSession().setAttribute("token", tokenPublic);
        }

        model.addAttribute("token", tokenPublic);
        if (apartmentSharing.isForOneTenant()) {
            model.addAttribute("tenant", apartmentSharing.getTenantApartmentSharing());
            model.addAttribute("showFiles", false);
            return "visit-file";
        } else {
            List<Tenant> tenants = new ArrayList<>();
            tenants.add(apartmentSharing.getTenantApartmentSharing());
            tenants.addAll(apartmentSharing.getTenants());
            model.addAttribute("tenants", tenants);
            model.addAttribute("apartmentSharing", apartmentSharing);
            model.addAttribute("token", tokenPublic);
            model.addAttribute("totalSalary", apartmentSharingService.totalSalary(apartmentSharing));
            request.getSession().setAttribute("token", apartmentSharing.getTokenPublic());
            return "visit-apartment-sharing-restricted";
        }
    }

    @GetMapping("/locataire/modifier-mon-compte")
    public String modifyProfile(Model model) {
        TenantDTO tenant = tenantService.getTenantLogged();
        Tenant tenantEntity = tenantService.displayTenantAccount();
        if (tenantEntity.getGuarantor() != null) {
            Guarantor guarantor = tenantEntity.getGuarantor();
            tenant.setGuarantor(new GuarantorDTO(guarantor));
        }
        if (null == tenant || tenantEntity.isValidated()) {
            return "redirect:/error";
        }
        model.addAttribute("tenant", tenant);
        model.addAttribute("tenantEntity", tenantEntity);
        return "modifier-mon-compte";
    }

    @PostMapping("/locataire/modifier-mon-compte")
    public ResponseEntity<?> modifyTenant(@Valid TenantDTO tenantDTO, BindingResult result, Model model) {
        if (!result.hasErrors()) {
            if (tenantService.modifyAccount(tenantDTO)) {
                return new ResponseEntity("Successfully uploaded!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        model.addAttribute("tenant", tenantDTO);
        return new ResponseEntity(result.getAllErrors(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/locataire/delete")
    public String delete(Model model, HttpServletRequest request, HttpServletResponse response) {
        Tenant tenantEntity = tenantService.displayTenantAccount();
        if (tenantEntity != null) {
            try {
                tenantService.deleteTenant(tenantEntity.getId());
            } catch (IOException e) {
                System.out.println(e);
            }
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/login?logout";
    }


}

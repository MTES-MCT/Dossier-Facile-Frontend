package fr.gouv.locatio.controller;

import fr.gouv.locatio.displayer.UserDisplayer;
import fr.gouv.locatio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home(Model model) {
        UserDisplayer userDisplayer = userService.createConnectedUserDisplayer();
        model.addAttribute("displayer", userDisplayer);
        return "index";
    }

    @GetMapping("/home")
    public ModelAndView index(Model model) {
        return new ModelAndView("redirect:/");
    }
}

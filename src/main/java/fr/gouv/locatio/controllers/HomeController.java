package fr.gouv.locatio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {


    @GetMapping("/")
    public ModelAndView index(Model model) {
        return new ModelAndView("redirect:/home");
    }

    @GetMapping("/home")
    public String home(Model model) {
        return "index";
    }


}

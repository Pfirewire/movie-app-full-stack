package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Autowiring url object so it can be passed to the model
    @Autowired
    private Url url;

    // Landing Page
    @GetMapping("/")
    public String landingPage(Model model) {
        // Adding url object to model
        model.addAttribute("url", url);
        return "movie/index";
    }
}

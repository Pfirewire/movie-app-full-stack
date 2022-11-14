package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Autowired
    private Url url;

    @GetMapping("/")
    public String landingPage(Model model) {
        model.addAttribute("url", url);
        return "movie/index";
    }
}

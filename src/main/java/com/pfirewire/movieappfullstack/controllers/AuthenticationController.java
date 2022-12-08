package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthenticationController {

    @Autowired
    private Url url;

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("url", url);
        model.addAttribute("user", new User());
        return "user/login";
    }
}

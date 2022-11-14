package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthenticationController {

    // Default Login Form Page
    @GetMapping("/login")
    public String showLoginForm(Model model) {
        // Adds an emtpy user attribute to the model
        model.addAttribute("user", new User());
        return "user/login";
    }
}

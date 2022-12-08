package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.MailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserController {

    // Repositories and Services
    private final UserRepository userDao;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    // Constructor
    public UserController(UserRepository userDao, PasswordEncoder passwordEncoder, MailService mailService) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    // Shows form to sign up as a user
    @GetMapping("/signup")
    public String showSignupForm(Model model) {
        // Sending empty user to template
        model.addAttribute("user", new User());
        return "user/signup";
    }

    // Saves user to users table
    @PostMapping("/signup")
    public String saveUser(@ModelAttribute User user) {
        // Hashing password
        String hash = passwordEncoder.encode(user.getPassword());
        // Setting user password to the hash and saving user to table
        user.setPassword(hash);
        userDao.save(user);
        return "redirect:/login";
    }

    @GetMapping("/pwreset")
    public String resetPasswordForm() {
        return "user/pw-reset";
    }

    @PostMapping("/pwreset")
    public String sendResetPasswordEmail(@RequestParam(name = "email") String email) {
        mailService.passwordReset(email);
        return "user/pw-reset-sent";
    }

}

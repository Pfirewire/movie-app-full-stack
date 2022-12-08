package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import com.pfirewire.movieappfullstack.repositories.PasswordResetRepository;
import com.pfirewire.movieappfullstack.services.MailService;
import com.pfirewire.movieappfullstack.services.Url;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PasswordResetController {

    private final PasswordResetRepository passwordResetDao;
    private final MailService mailService;
    @Autowired
    private Url url;

    public PasswordResetController(PasswordResetRepository passwordResetDao, MailService mailService) {
        this.passwordResetDao = passwordResetDao;
        this.mailService = mailService;
    }

    @GetMapping("/pwreset")
    public String forgotPasswordLink(Model model) {
        model.addAttribute("url", url);
        return "user/forgot-pw";
    }

    @PostMapping("/pwreset")
    public String sendForgotPasswordEmail(@RequestParam(name = "email") String email, Model model) {
        PasswordReset passwordReset = new PasswordReset(email, Utils.generatePasswordResetToken(), Utils.generatePasswordResetTimestamp());
        passwordResetDao.save(passwordReset);
        mailService.passwordReset(passwordReset);
        model.addAttribute("url", url);
        return "user/pw-reset-sent";
    }

    @GetMapping("/pwreset/{token}")
    public String resetPasswordForm(@PathVariable String token, Model model) {
        PasswordReset passwordReset = passwordResetDao.findByToken(token);
        model.addAttribute("passwordReset", passwordReset);
        model.addAttribute("url", url);
        return "user/pw-reset";
    }

    @PostMapping("pwreset/{token}")
    public String resetPassword(@ModelAttribute PasswordReset passwordReset) {
        System.out.println(passwordReset.toString());
        System.out.println(passwordReset.getEmail());
        System.out.println(passwordReset.getToken());
        System.out.println(passwordReset.getExpirationDate().toString());
//        System.out.printf("Email associated with this link: %s%n", passwordReset.getEmail());
        return "redirect:/";
    }

}

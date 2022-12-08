package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import com.pfirewire.movieappfullstack.repositories.PasswordResetRepository;
import com.pfirewire.movieappfullstack.services.MailService;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PasswordResetController {

    private final PasswordResetRepository passwordResetDao;
    private final MailService mailService;

    public PasswordResetController(PasswordResetRepository passwordResetDao, MailService mailService) {
        this.passwordResetDao = passwordResetDao;
        this.mailService = mailService;
    }

    @GetMapping("/pwreset")
    public String forgotPasswordLink() {
        return "user/forgot-pw";
    }

    @PostMapping("/pwreset")
    public String sendForgotPasswordEmail(@RequestParam(name = "email") String email) {
        PasswordReset passwordReset = new PasswordReset(email, Utils.generatePasswordResetToken(), Utils.generatePasswordResetTimestamp());
        mailService.passwordReset(passwordReset);
        return "user/pw-reset-sent";
    }

    @GetMapping("/pwreset/{token}")
    public String resetPasswordForm() {
        return "user/pw-reset";
    }

}

package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.PasswordResetRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.MailService;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.Date;

@Controller
public class PasswordResetController {

    private final PasswordResetRepository passwordResetDao;
    private final UserRepository userDao;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetController(PasswordResetRepository passwordResetDao, UserRepository userDao, MailService mailService, PasswordEncoder passwordEncoder) {
        this.passwordResetDao = passwordResetDao;
        this.userDao = userDao;
        this.mailService = mailService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/pwreset")
    public String forgotPasswordLink(Model model) {
        return "reset/forgot-pw";
    }

    @PostMapping("/pwreset")
    public String sendForgotPasswordEmail(@RequestParam(name = "email") String email, Model model) throws MessagingException {
        PasswordReset passwordReset = new PasswordReset(email, Utils.generatePasswordResetToken(), Utils.generatePasswordResetTimestamp());
        passwordResetDao.save(passwordReset);
        mailService.passwordReset(passwordReset);
        return "reset/pw-reset-sent";
    }

    @GetMapping("/pwreset/{token}")
    public String resetPasswordForm(@PathVariable String token, Model model) {
        PasswordReset passwordReset = passwordResetDao.findByToken(token);
        if(passwordReset == null) {
            return "redirect:/pwreset?invalid";
        }
        else if(new Date().getTime() > passwordReset.getExpirationDate().getTime()) {
            return "redirect:/pwreset?expired";
        }
        User user = userDao.findByEmail(passwordReset.getEmail());
        model.addAttribute("user", user);
        model.addAttribute("passwordReset", passwordReset);
        return "reset/pw-reset";
    }

    @PostMapping("pwreset/{token}")
    public String resetPassword(@ModelAttribute User user, @PathVariable String token) {
        PasswordReset passwordReset = passwordResetDao.findByToken(token);
        if(passwordReset == null) {
            return "redirect:/pwreset?invalid";
        }
        else if(new Date().getTime() > passwordReset.getExpirationDate().getTime()) {
            return "redirect:/pwreset?expired";
        }
        User newUser = userDao.findByUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(newUser);
        return "redirect:/login?reset.html";
    }

}

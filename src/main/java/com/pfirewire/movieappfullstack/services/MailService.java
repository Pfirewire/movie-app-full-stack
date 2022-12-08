package com.pfirewire.movieappfullstack.services;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("mailService")
public class MailService {

    @Autowired
    public JavaMailSender emailSender;

    // local variable for email that email service sends from
    @Value("${spring.mail.from}")
    private String from;


    // Prepares and sends password recovery email
    public void passwordReset(PasswordReset passwordReset) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(passwordReset.getEmail());
        msg.setSubject("Password Reset Request");
        msg.setText("" +
                "Please click this link to reset your password:" +
                "%n" +
                "localhost:8080/" + passwordReset.getToken()
        );

        try {
            this.emailSender.send(msg);
        } catch (MailException ex) {
            System.err.println(ex.getMessage());
        }
    }
}
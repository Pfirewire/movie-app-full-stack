package com.pfirewire.movieappfullstack.services;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Service("mailService")
public class MailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    // local variable for email that email service sends from
    @Value("${spring.mail.from}")
    private String from;


    // Prepares and sends password recovery email
    public void passwordReset(PasswordReset passwordReset) {
        String processedHTMLTemplate = this.constructHTMLTemplate(passwordReset.getToken());

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(passwordReset.getEmail());
        msg.setSubject("Password Reset Request");
        msg.setText(processedHTMLTemplate);

        try {
            this.emailSender.send(msg);
        } catch (MailException ex) {
            System.err.println(ex.getMessage());
        }
    }

    private String constructHTMLTemplate(String token) {
        Context context = new Context();
        context.setVariable("token", token);
        return templateEngine.process("emails/reset", context);
    }
}
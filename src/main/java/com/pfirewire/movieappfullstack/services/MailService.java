package com.pfirewire.movieappfullstack.services;

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
    public void passwordReset(String email) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(email);
        msg.setSubject("Password Reset Request");
        msg.setText("" +
                "This is a test email." +
                "Eventually it will include a link to reset email."
        );
    }

    // Prepares and sends email with subject and body parameters
//    public void prepareAndSend(Post post, String subject, String body) {
//
//        SimpleMailMessage msg = new SimpleMailMessage();
//        msg.setFrom(from);
//        msg.setTo(post.getUser().getEmail());
//        msg.setSubject(subject);
//        msg.setText(body);
//
//        try {
//            this.emailSender.send(msg);
//        } catch (MailException ex) {
//            System.err.println(ex.getMessage());
//        }
//    }
}
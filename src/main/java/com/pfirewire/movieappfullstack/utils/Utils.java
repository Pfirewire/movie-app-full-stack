package com.pfirewire.movieappfullstack.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pfirewire.movieappfullstack.models.User;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public class Utils {

    public static User currentUser() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(SecurityContextHolder.getContext().getAuthentication().getPrincipal()));
        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String generatePasswordResetToken() {
        return  UUID.randomUUID().toString();
    }

    public static Timestamp generatePasswordResetTimestamp() {
        return new Timestamp(new Date().getTime() + TimeUnit.MINUTES.toMillis(10));
    }
}

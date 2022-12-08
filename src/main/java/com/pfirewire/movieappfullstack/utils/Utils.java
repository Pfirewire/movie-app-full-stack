package com.pfirewire.movieappfullstack.utils;

import com.pfirewire.movieappfullstack.models.User;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public class Utils {

    public static User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String generatePasswordResetToken() {
        return UUID.randomUUID().toString();
    }

    public static Timestamp generatePasswordResetTimestamp() {
        Timestamp timestamp = new Timestamp(new Date().getTime() + TimeUnit.MINUTES.toMillis(5));
        System.out.println(timestamp.toLocalDateTime());
        return timestamp;
    }
}

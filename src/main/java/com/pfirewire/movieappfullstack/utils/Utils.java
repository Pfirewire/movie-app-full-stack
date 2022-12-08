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
        String uuid = UUID.randomUUID().toString();
        System.out.printf("Token created: %s%n", uuid);
        return uuid;
    }

    public static Timestamp generatePasswordResetTimestamp() {
        Timestamp timestamp = new Timestamp(new Date().getTime() + TimeUnit.MINUTES.toMillis(5));
        System.out.printf("Timestamp: ", timestamp.toLocalDateTime().toString());
        return timestamp;
    }
}

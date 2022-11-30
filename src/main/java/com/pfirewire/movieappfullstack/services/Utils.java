package com.pfirewire.movieappfullstack.services;

import com.pfirewire.movieappfullstack.models.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {

    public static User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}

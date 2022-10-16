package com.pfirewire.movieappfullstack.utils;

import com.pfirewire.movieappfullstack.models.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {



    public static User currentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}

package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.services.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeyController {

    // Autowiring keys object
    @Autowired
    private Keys keys;

    // Get response for returning private keys
    @GetMapping("/keys")
    public Keys getKeys() {
        return keys;
    }
}

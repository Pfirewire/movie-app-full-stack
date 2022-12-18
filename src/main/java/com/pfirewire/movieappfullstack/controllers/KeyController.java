package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.services.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeyController {

    @Autowired
    private Keys keys;

    @GetMapping("/keys")
//    @CrossOrigin(origins = {"https://pfirewire.com", "https://www.pfirewire.com"})
    public Keys getKeys() {
        return keys;
    }
}

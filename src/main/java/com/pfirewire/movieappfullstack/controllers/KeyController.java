package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.services.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"https://pfirewire.com", "https://www.pfirewire.com"})
public class KeyController {

    @Autowired
    private Keys keys;

    @GetMapping(value="/keys.js", produces = "application/javascript")
    public String getKeys() {
//        return keys;
        return String.format("""
                const keys = {
                    unsplashKey: "%s,
                    filestackKey: %s,
                    tmdbKey: %s,
                }
        """, keys.getUnsplashKey(), keys.getFilestackKey(), keys.getTmdbKey());
    }
}

//@RestController
//public class KeysController {
//    @Autowired
//    private KeysConfig keys;
//
//    @GetMapping(value="/keys.js", produces = "application/javascript")
//    public String getKeys(){
//        String theKeys = String.format("""
//                keys = {
//                        filestack: "%s",
//                        mapbox: "%s",
//                        talkjs: "%s",
//                }
//                """, keys.fileStack, keys.mapbox, keys.talkjs);
//        return theKeys;
//
//    }
//}

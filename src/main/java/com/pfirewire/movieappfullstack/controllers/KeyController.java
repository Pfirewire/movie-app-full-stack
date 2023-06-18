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

    @GetMapping(value="/keys.js", produces = "application/javascript")
    public String getKeys() {
//        return keys;
        return String.format("""
                const UNSPLASH_KEY = "%s";
                const FILESTACK_KEY = "%s";
                const TMDB_KEY = "%s";
        """, keys.getUNSPLASH_KEY(), keys.getFILESTACK_KEY(), keys.getTMDB_KEY());
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

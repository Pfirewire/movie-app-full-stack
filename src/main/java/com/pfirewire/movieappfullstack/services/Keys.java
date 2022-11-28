package com.pfirewire.movieappfullstack.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Keys {

    @Value("${tmdbKey}")
    private String tmdbKey;

    @Value("${unsplashKey}")
    private String unsplashKey;

    @Value("${backRoomKey}")
    private String backRoomKey;

    public Keys() {}

    public String getTmdbKey() {
        return tmdbKey;
    }

    public void setTmdbKey(String tmdbKey) {
        this.tmdbKey = tmdbKey;
    }

    public String getBackRoomKey() {
        return backRoomKey;
    }

    public void setBackRoomKey(String backRoomKey) {
        this.backRoomKey = backRoomKey;
    }
}

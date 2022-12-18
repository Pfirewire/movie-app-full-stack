package com.pfirewire.movieappfullstack.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Keys {



    @Value("${tmdbKey}")
    private String tmdbKey;

    @Value("${unsplashKey}")
    private String unsplashKey;

    @Value("${filestackKey}")
    private String filestackKey;

    public Keys() {}

    public String getTmdbKey() {
        return tmdbKey;
    }

    public void setTmdbKey(String tmdbKey) {
        this.tmdbKey = tmdbKey;
    }

    public String getUnsplashKey() {
        return unsplashKey;
    }

    public void setUnsplashKey(String unsplashKey) {
        this.unsplashKey = unsplashKey;
    }

    public String getFilestackKey() {
        return filestackKey;
    }

    public void setFilestackKey(String filestackKey) {
        this.filestackKey = filestackKey;
    }
}

package com.pfirewire.movieappfullstack.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Keys {



    @Value("${tmdbKey}")
    private String TMDB_KEY;

    @Value("${unsplashKey}")
    private String UNSPLASH_KEY;

    @Value("${filestackKey}")
    private String FILESTACK_KEY;

    public Keys() {}

    public String getTMDB_KEY() {
        return TMDB_KEY;
    }

    public void setTMDB_KEY(String TMDB_KEY) {
        this.TMDB_KEY = TMDB_KEY;
    }

    public String getUNSPLASH_KEY() {
        return UNSPLASH_KEY;
    }

    public void setUNSPLASH_KEY(String UNSPLASH_KEY) {
        this.UNSPLASH_KEY = UNSPLASH_KEY;
    }

    public String getFILESTACK_KEY() {
        return FILESTACK_KEY;
    }

    public void setFILESTACK_KEY(String FILESTACK_KEY) {
        this.FILESTACK_KEY = FILESTACK_KEY;
    }
}

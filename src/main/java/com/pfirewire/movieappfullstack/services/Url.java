package com.pfirewire.movieappfullstack.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Url {

    @Value("${baseUrl}")
    private String baseUrl;

    public Url() {}

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}

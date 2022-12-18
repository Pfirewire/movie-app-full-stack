package com.pfirewire.movieappfullstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class MovieAppFullStackApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieAppFullStackApplication.class, args);
    }

}

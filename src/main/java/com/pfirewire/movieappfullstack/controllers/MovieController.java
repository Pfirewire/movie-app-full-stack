package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class MovieController {

    private MovieRepository movieDao;

    public MovieController(MovieRepository movieDao) {
        this.movieDao = movieDao;
    }



    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }

    @PostMapping("/movie/add")
    public String addMovie (@RequestBody Movie movie) {
        System.out.println("inside addMovie");
        movie.setUser((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        System.out.println("movie.setUser complete");
        movieDao.save(movie);
        System.out.println("save movie complete");
        return "completed addMovie";
    }



}

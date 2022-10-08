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

@Controller
public class MovieController {

    private MovieRepository movieDao;

    public MovieController(MovieRepository movieDao) {
        this.movieDao = movieDao;
    }

    @GetMapping("/my-movies")
    public String showMyMoviesIndex(Model model) {
        return "movie/my-movies";
    }

    @GetMapping("/health")
    public void healthCheck() {
        System.out.println("test");
    }

    @PostMapping("/movie/add")
    public void addMovie (@RequestBody Movie movie) {
        System.out.println("made it inside addMovie post mapper");
        System.out.println(movie.getTitle());
    }



}

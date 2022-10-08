package com.pfirewire.movieappfullstack.controllers;

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



}

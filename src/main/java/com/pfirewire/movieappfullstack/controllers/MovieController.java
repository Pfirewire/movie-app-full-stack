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
    private UserRepository userDao;

    public MovieController(MovieRepository movieDao, UserRepository userDao) {
        this.movieDao = movieDao;
        this.userDao = userDao;
    }



    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }

    @GetMapping("/movies.json")
    public List<Movie> getAllMovies() {
        System.out.println("Inside getAllMovies");
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("User set");
        return movieDao.findByUser(user);
    }

    @PostMapping("/movie/add")
    public String addMovie (@RequestBody Movie movie) {
        movie.setUser((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        movieDao.save(movie);
        return "completed addMovie";
    }



}

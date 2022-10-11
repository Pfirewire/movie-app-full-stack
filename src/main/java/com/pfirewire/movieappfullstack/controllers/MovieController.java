package com.pfirewire.movieappfullstack.controllers;

import ch.qos.logback.core.util.CloseUtil;
import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import org.springframework.http.MediaType;
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

    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Movie> userMovies = movieDao.findAllByUser(user);
        return userMovies;
    }

    @PostMapping("/movie/{id}/delete")
    public String deleteMovie(@PathVariable Long id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Movie movie = movieDao.getById(id);
        User moviesUser = movie.getUser();
        if(user.equals(moviesUser)) {
            movieDao.delete(movie);
            return "movie deleted";
        } else {
            return "unable to delete, user does not match";
        }
    }

    @PostMapping("/movie/add")
    public String addMovie (@RequestBody Movie movie) {
        System.out.println("inside addMovie");
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        movie.setUser(user);
        System.out.println(user.getUsername());
        movieDao.save(movie);
        return "completed addMovie";
    }

}

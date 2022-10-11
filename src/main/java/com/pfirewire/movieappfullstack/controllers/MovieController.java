package com.pfirewire.movieappfullstack.controllers;

import ch.qos.logback.core.util.CloseUtil;
import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
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

    @DeleteMapping("/movie/{id}/delete")
    public String deleteMovie(@PathVariable Long id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Movie movie = movieDao.getById(id);
        User moviesUser = movie.getUser();
        if(user.getId().equals(moviesUser.getId())) {
            movieDao.delete(movie);
            return "movie deleted";
        } else {
            return "unable to delete, user does not match";
        }
    }

    @PostMapping("/movie/add")
    public String addMovie (@RequestBody Movie movie) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        movie.setUser(user);
        movieDao.save(movie);
        return "completed addMovie";
    }

    @PatchMapping("/movie/{id}/edit")
    public String editMovie(@RequestBody Movie movie, @PathVariable Long id) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(movieDao.getById(id).getUser().getId().equals(user.getId())){
            movie.setUser(user);
            movieDao.save(movie);
        }
        return "completed editMovie";
    }

}

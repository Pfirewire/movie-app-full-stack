package com.pfirewire.movieappfullstack.controllers;

import ch.qos.logback.core.util.CloseUtil;
import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.Rating;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.*;
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
    private MovieListRepository listDao;
    private RatingRepository ratingDao;
    private ReviewRepository reviewDao;

    public MovieController(
            MovieRepository movieDao,
            UserRepository userDao,
            MovieListRepository listDao,
            RatingRepository ratingDao,
            ReviewRepository reviewDao)
    {
        this.movieDao = movieDao;
        this.userDao = userDao;
        this.listDao = listDao;
        this.ratingDao = ratingDao;
        this.reviewDao = reviewDao;
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

    @DeleteMapping("/movie/{movieId}/{listId}/delete")
    public String deleteMovie(@PathVariable Long movieId, @PathVariable Long listId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Movie movie = movieDao.getById(movieId);
        MovieList list = listDao.getById(listId);
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList) {
            movieDao.delete(movie);
            return "movie deleted";
        } else return "you are not a member of this list";
    }

    @PostMapping("/movie/{listId}/add")
    public String addMovie (@RequestBody Movie movie, @PathVariable Long listId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MovieList list = listDao.getById(listId);
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList) movieDao.save(movie);
        return "completed addMovie";
    }

    @PatchMapping("/movie/{movieId}/rating/edit")
    public String editMovie(@RequestBody Movie movie, @PathVariable Long movieId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Rating rating = ratingDao
        Boolean userIsMember = isMember(list.getMembers(), user);
        if()
        if(movieDao.getById(id).getUser().getId().equals(user.getId())){
            movie.setUser(user);
            movieDao.save(movie);
        }
        return "completed editMovie";
    }

    private Boolean isMember(List<User> listMembers, User user) {
        Boolean userIsMemberOfList = false;
        for(User listMember : listMembers) {
            if(user.getId().equals(listMember.getId())) userIsMemberOfList = true;
        }
        return userIsMemberOfList;
    }



}

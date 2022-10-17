package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Rating;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.RatingRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.web.bind.annotation.*;

@RestController
public class RatingController {


    private UserRepository userDao;
    private MovieRepository movieDao;
    private RatingRepository ratingDao;

    public RatingController(UserRepository userDao, MovieRepository movieDao, RatingRepository ratingDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.ratingDao = ratingDao;
    }

    @GetMapping("/rating/{movieId}")
    public Rating getRating(@PathVariable Long movieId) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        Rating rating = ratingDao.findByUserAndMovie(user, movie);
        if(rating == null) {
            return new Rating(-1);
        } else {
            return rating;
        }
    }

    @PostMapping("/rating/{movieId}")
    public String addRating (@RequestBody Rating rating, @PathVariable Long movieId) {
        System.out.println("inside addRating");
        User user = Utils.currentUser();
        rating.setUser(user);
        rating.setMovie(movieDao.getById(movieId));
        ratingDao.save(rating);
        return "completed addRating";
    }

    @PatchMapping("/rating/{movieId}")
    public String editRating(@RequestBody Rating newRating, @PathVariable Long movieId) {
        System.out.println("inside editRating");
        User user = Utils.currentUser();
        Rating oldRating = ratingDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldRating.setRating(newRating.getRating());
        ratingDao.save(oldRating);
        return "completed editRating";
    }
}

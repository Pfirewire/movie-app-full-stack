package com.pfirewire.movieappfullstack.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Rating;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.RatingRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.web.bind.annotation.*;

@RestController
public class RatingController {


    private final UserRepository userDao;
    private final MovieRepository movieDao;
    private final RatingRepository ratingDao;

    public RatingController(UserRepository userDao, MovieRepository movieDao, RatingRepository ratingDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.ratingDao = ratingDao;
    }

    @GetMapping("/rating/{movieId}")
    public Rating getRating(@PathVariable Long movieId) throws JsonProcessingException {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        Rating rating = ratingDao.findByUserAndMovie(user, movie);
        if(rating == null) {
            return new Rating(-1);
        } else {
            return rating;
        }
    }

    @GetMapping("/rating/{movieId}/{userId}")
    public Rating getRating(@PathVariable Long movieId, @PathVariable Long userId) {
        User user = userDao.getById(userId);
        Movie movie = movieDao.getById(movieId);
        Rating rating = ratingDao.findByUserAndMovie(user, movie);
        if(rating == null) {
            return new Rating(-1);
        } else {
            return rating;
        }
    }

    @PostMapping("/rating/{movieId}")
    public String addRating (@RequestBody Rating rating, @PathVariable Long movieId) throws JsonProcessingException {
        User user = Utils.currentUser();
        rating.setUser(user);
        rating.setMovie(movieDao.getById(movieId));
        ratingDao.save(rating);
        return "completed addRating";
    }

    @PatchMapping("/rating/{movieId}")
    public String editRating(@RequestBody Rating newRating, @PathVariable Long movieId) throws JsonProcessingException {
        User user = Utils.currentUser();
        Rating oldRating = ratingDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldRating.setValue(newRating.getValue());
        ratingDao.save(oldRating);
        return "completed editRating";
    }
}

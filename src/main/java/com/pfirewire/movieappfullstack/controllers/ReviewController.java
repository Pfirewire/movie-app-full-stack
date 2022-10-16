package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Review;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.ReviewRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {

    private UserRepository userDao;
    private MovieRepository movieDao;
    private ReviewRepository reviewDao;

    public ReviewController(UserRepository userDao, MovieRepository movieDao, ReviewRepository reviewDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.reviewDao = reviewDao;
    }

    @PostMapping("/review/{movieId}/add")
    public String addReview (@RequestBody Review review, @PathVariable Long movieId) {
        User user = Utils.currentUser();
        review.setUser(user);
        review.setMovie(movieDao.getById(movieId));
        reviewDao.save(review);
        return "completed addReview";
    }

    @PatchMapping("/review/{movieId}/edit")
    public String editReview(@RequestBody Review newReview, @PathVariable Long movieId) {
        User user = Utils.currentUser();
        Review oldReview = reviewDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldReview.setReview(newReview.getReview());
        reviewDao.save(oldReview);
        return "completed editReview";
    }
}

package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Review;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.ReviewRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ReviewController {

    private UserRepository userDao;
    private MovieRepository movieDao;
    private ReviewRepository reviewDao;

    public ReviewController(UserRepository userDao, MovieRepository movieDao, ReviewRepository reviewDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.reviewDao = reviewDao;
    }

    @GetMapping("/review/{movieId}")
    public String reviewForm (@PathVariable Long movieId, Model model) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        Review review = reviewDao.findByUserAndMovie(user, movie);
        model.addAttribute("movie", movie);
        System.out.println("inside reviewForm in ReviewController. Movie being pushed id: ");
        System.out.println(movie.getId());
        if(review == null) {
            model.addAttribute("review", new Review());
            return "movie/review/add";
        } else {
            model.addAttribute("review", review);
            return "movie/review/edit";
        }
    }

    @PostMapping("/review/{movieId}")
    public String addReview (@ModelAttribute Review review, @PathVariable Long movieId, Model model) {
        System.out.println("inside addReview");
        User user = Utils.currentUser();
        System.out.printf("User name: %s%n", user.getUsername());
        Movie movie = movieDao.getById(movieId);
        System.out.printf("Movie title: %s%n", movie.getTitle());
        review.setUser(user);
        review.setMovie(movie);
        reviewDao.save(review);
        model.addAttribute("movie", movie);
        model.addAttribute("review", review);
        return "movie/review/view";
    }

    @PatchMapping("/review/{movieId}")
    public String editReview(@ModelAttribute Review review, @PathVariable Long movieId, Model model) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        review.setUser(user);
        review.setMovie(movie);
        reviewDao.save(review);
        model.addAttribute("movie", movie);
        model.addAttribute("review", review);
        return "movie/review/view";
    }
}

package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Rating;
import com.pfirewire.movieappfullstack.models.Review;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.ReviewRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PreRemove;

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
        if(review == null) {
            System.out.println("review does not exist, redirecting to add review");
            model.addAttribute("review", new Review());
            return "movie/review/add";
        } else {
            model.addAttribute("review", review);
            System.out.println("review exists, redirecting to edit review");
            return "movie/review/edit";
        }
    }

    @PostMapping("/review/{movieId}")
    public String addReview (@ModelAttribute Review review, @PathVariable Long movieId, Model model) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        review.setUser(user);
        review.setMovie(movie);
        reviewDao.save(review);
        model.addAttribute("movie", movie);
        model.addAttribute("review", review);
        return "movie/review/view";
    }

    @PostMapping("/review/{movieId}/edit")
    public String editReview(@ModelAttribute Review newReview, @PathVariable Long movieId, Model model) {
        System.out.println("Inside editReview");
        User user = Utils.currentUser();
        System.out.printf("User writing review: %s%n", user.getUsername());
        Movie movie = movieDao.getById(movieId);
        System.out.printf("Movie review is about: %s%n", movie.getTitle());
        Review oldReview = reviewDao.findByUserAndMovie(user, movie);
        System.out.printf("Old review title: %s%n", oldReview.getTitle());
        oldReview.setBody(newReview.getBody());
        System.out.printf("Old review with new title: %s%n", oldReview.getTitle());
        System.out.printf("Old review body: %s%n", oldReview.getBody());
        oldReview.setTitle(newReview.getTitle());
        System.out.printf("Old review with new body: %s%n", oldReview.getBody());
        reviewDao.save(oldReview);
        model.addAttribute("movie", movie);
        model.addAttribute("review", oldReview);
        return "movie/review/view";
    }
}

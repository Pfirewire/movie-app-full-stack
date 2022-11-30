package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Review;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.ReviewRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import com.pfirewire.movieappfullstack.services.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class ReviewController {

    private final UserRepository userDao;
    private final MovieRepository movieDao;
    private final ReviewRepository reviewDao;
    @Autowired
    private Url url;

    public ReviewController(UserRepository userDao, MovieRepository movieDao, ReviewRepository reviewDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.reviewDao = reviewDao;
    }

    @GetMapping("/review/all/view")
    public String showAllReviews(Model model) {
        model.addAttribute("url", url);
        return "movie/review/view-all";
    }

    @GetMapping("/review/user/view")
    public String showUserReviews(Model model) {
        model.addAttribute("url", url);
        return "movie/review/view-user";
    }

    @GetMapping("/review/{reviewId}/view")
    public String viewReview(@PathVariable Long reviewId, Model model) {
        Review review = reviewDao.getById(reviewId);
        model.addAttribute("review", review);
        model.addAttribute("movie", review.getMovie());
        model.addAttribute("reviewUser", review.getUser());
        return "movie/review/view";
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
        model.addAttribute("reviewUser", review.getUser());
        return "movie/review/view";
    }

    @PostMapping("/review/{movieId}/edit")
    public String editReview(@ModelAttribute Review newReview, @PathVariable Long movieId, Model model) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        Review oldReview = reviewDao.findByUserAndMovie(user, movie);
        oldReview.setBody(newReview.getBody());
        oldReview.setTitle(newReview.getTitle());
        reviewDao.save(oldReview);
        model.addAttribute("movie", movie);
        model.addAttribute("review", oldReview);
        model.addAttribute("reviewUser", oldReview.getUser());
        return "movie/review/view";
    }

    @GetMapping("/reviews/all")
    public @ResponseBody Set<Review> getAllReviews(Model model) {
        List<Review> reviewList = reviewDao.findAll();
        Set<Review> reviews = new HashSet<>();
        reviews.addAll(reviewList);
        return reviews;
    }

    @GetMapping("/reviews/user")
    public @ResponseBody Set<Review> getUserMyReviews(Model model) {
        User user = Utils.currentUser();
        return reviewDao.findAllByUser(user);
    }

    @GetMapping("/reviews/user/{userId}")
    public @ResponseBody Set<Review> getUserReviews(@PathVariable Long userId, Model model) {
        User user = userDao.getById(userId);
        return reviewDao.findAllByUser(user);
    }
}

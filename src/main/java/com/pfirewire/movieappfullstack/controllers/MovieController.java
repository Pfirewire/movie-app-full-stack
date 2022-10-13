package com.pfirewire.movieappfullstack.controllers;

import ch.qos.logback.core.util.CloseUtil;
import com.pfirewire.movieappfullstack.models.*;
import com.pfirewire.movieappfullstack.repositories.*;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

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

    private Boolean isMember(Set<User> listMembers, User user) {
        System.out.println("inside ismember");
        Boolean userIsMemberOfList = false;
        for(User listMember : listMembers) {
            System.out.println("inside for list member loop in isMember");
            System.out.println("listmember id: ");
            System.out.println(listMember.getId());
            System.out.println("user id: ");
            System.out.println(user.getId());
            if(user.getId().equals(listMember.getId())) userIsMemberOfList = true;
        }
        return userIsMemberOfList;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }

    @GetMapping("/movies/{listId}")
    public Set<Movie> getAllMovies(@PathVariable Long listId) {
        MovieList list = listDao.getById(listId);
        Set<Movie> userMovies = list.getMovies();
        return userMovies;
    }

    @DeleteMapping("/movie/{movieId}/{listId}/delete")
    public String deleteMovie(@PathVariable Long movieId, @PathVariable Long listId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Movie movie = movieDao.getById(movieId);
        MovieList list = listDao.getById(listId);
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList) {
            list.deleteMovie(movie);
            return "movie deleted";
        } else return "you are not a member of this list";
    }

    @PostMapping("/movie/{listId}/add")
    public Movie addMovie (@RequestBody Movie movie, @PathVariable Long listId) {
        System.out.println("inside add movie");
        if(!movieDao.existsByTmdbId(movie.getTmdbId())){
            System.out.println("movie is not in the list, it will be saved");
            movieDao.save(movie);
        }
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MovieList list = listDao.getById(listId);
        System.out.println("List has been saved. it's id is: ");
        System.out.println(list.getId());
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList){
            System.out.println("inside add movie if statement");
            list.addMovie(movie);
        }
        return movieDao.getByTmdbId(movie.getTmdbId());
    }

    @PostMapping("/rating/{movieId}/add")
    public String addRating (@RequestBody Rating rating, @PathVariable Long movieId) {
        System.out.println("inside addRating");
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        rating.setUser(user);
        rating.setMovie(movieDao.getById(movieId));
        ratingDao.save(rating);
        return "completed addRating";
    }

    @PostMapping("/review/{movieId}/add")
    public String addReview (@RequestBody Review review, @PathVariable Long movieId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        review.setUser(user);
        review.setMovie(movieDao.getById(movieId));
        reviewDao.save(review);
        return "completed addReview";
    }

    @PatchMapping("/rating/{movieId}/edit")
    public String editRating(@RequestBody Rating newRating, @PathVariable Long movieId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Rating oldRating = ratingDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldRating.setRating(newRating.getRating());
        ratingDao.save(oldRating);
        return "completed editRating";
    }

    @PatchMapping("/review/{movieId}/edit")
    public String editReview(@RequestBody Review newReview, @PathVariable Long movieId) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Review oldReview = reviewDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldReview.setReview(newReview.getReview());
        reviewDao.save(oldReview);
        return "completed editReview";
    }





}

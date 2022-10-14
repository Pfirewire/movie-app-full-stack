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
            if(user.getId() == listMember.getId()) userIsMemberOfList = true;
        }
        System.out.println("userIsMemberOfList is: ");
        System.out.println(userIsMemberOfList);
        return userIsMemberOfList;
    }

    private User currentUser() {
        return (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    }

    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }

    @GetMapping("/movie/list/all")
    public Set<MovieList> getAllMovieLists() {
        User user = currentUser();
        System.out.printf("Inside getAllMovieLists. Current user is: %s%n", user.getUsername());
        Set<MovieList> userMovieLists = listDao.findAllByUser(user);
        System.out.printf("User movie lists acquired, this should not be null: %s%n", userMovieLists.toString());
        return userMovieLists;
    }

    @GetMapping("/movies/{listId}")
    public Set<Movie> getAllMovies(@PathVariable Long listId) {
        MovieList list = listDao.getById(listId);
        Set<Movie> userMovies = list.getMovies();
        return userMovies;
    }

    @DeleteMapping("/movie/{movieId}/{listId}/delete")
    public String deleteMovie(@PathVariable Long movieId, @PathVariable Long listId) {
        User user = currentUser();
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
        System.out.println("inside addMovie");
        if(!movieDao.existsByTmdbId(movie.getTmdbId())){
            movieDao.save(movie);
        } else {
            movie = movieDao.getByTmdbId(movie.getTmdbId());
        }
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.printf("Current user id is: %s%n", user.getId());
        MovieList list = listDao.getById(listId);

        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList){
            System.out.println("inside if statement");
            list.getMovies().add(movie);
            listDao.save(list);
        }
        return movieDao.getByTmdbId(movie.getTmdbId());
    }

    @PostMapping("/rating/{movieId}/add")
    public String addRating (@RequestBody Rating rating, @PathVariable Long movieId) {
        System.out.println("inside addRating");
        User user = currentUser();
        rating.setUser(user);
        rating.setMovie(movieDao.getById(movieId));
        ratingDao.save(rating);
        return "completed addRating";
    }

    @PostMapping("/review/{movieId}/add")
    public String addReview (@RequestBody Review review, @PathVariable Long movieId) {
        User user = currentUser();
        review.setUser(user);
        review.setMovie(movieDao.getById(movieId));
        reviewDao.save(review);
        return "completed addReview";
    }

    @PatchMapping("/rating/{movieId}/edit")
    public String editRating(@RequestBody Rating newRating, @PathVariable Long movieId) {
        User user = currentUser();
        Rating oldRating = ratingDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldRating.setRating(newRating.getRating());
        ratingDao.save(oldRating);
        return "completed editRating";
    }

    @PatchMapping("/review/{movieId}/edit")
    public String editReview(@RequestBody Review newReview, @PathVariable Long movieId) {
        User user = currentUser();
        Review oldReview = reviewDao.findByUserAndMovie(user, movieDao.getById(movieId));
        oldReview.setReview(newReview.getReview());
        reviewDao.save(oldReview);
        return "completed editReview";
    }
}

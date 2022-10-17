package com.pfirewire.movieappfullstack.controllers;

import ch.qos.logback.core.util.CloseUtil;
import com.pfirewire.movieappfullstack.models.*;
import com.pfirewire.movieappfullstack.repositories.*;
import com.pfirewire.movieappfullstack.services.Url;
import com.pfirewire.movieappfullstack.utils.Utils;
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

    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }


    @GetMapping("/movies/{listId}")
    public Set<Movie> getAllMovies(@PathVariable Long listId) {
        System.out.println("inside getAllMovies. listID: ");
        System.out.println(listId);
        MovieList list = listDao.findById(listId).get();
        Set<Movie> userMovies = list.getMovies();
        return userMovies;
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

    @DeleteMapping("/movie/{movieId}/{listId}/delete")
    public String deleteMovie(@PathVariable Long movieId, @PathVariable Long listId) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        MovieList list = listDao.getById(listId);
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList) {
            list.getMovies().remove(movie);
            listDao.save(list);
            return "movie deleted";
        } else return "you are not a member of this list";
    }
}

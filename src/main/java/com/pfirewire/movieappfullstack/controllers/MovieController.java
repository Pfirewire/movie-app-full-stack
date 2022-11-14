package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.*;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
public class MovieController {


    // Private properties, mostly repositories
    private final MovieRepository movieDao;
    private final MovieListRepository listDao;

    public MovieController(
            MovieRepository movieDao,
            MovieListRepository listDao)
    {
        this.movieDao = movieDao;
        this.listDao = listDao;
    }

    private Boolean isMember(Set<User> listMembers, User user) {
        Boolean userIsMemberOfList = false;
        for(User listMember : listMembers) {
            if(user.getId() == listMember.getId()) userIsMemberOfList = true;
        }
        return userIsMemberOfList;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "health check complete";
    }

    @GetMapping("/movie/{movieId}")
    public Movie getMovieById(@PathVariable Long movieId) {
        return movieDao.getById(movieId);
    }

    @GetMapping("/movies/{listId}")
    public Set<Movie> getAllMovies(@PathVariable Long listId) {
        MovieList list = listDao.findById(listId).get();
        Set<Movie> userMovies = list.getMovies();
        return userMovies;
    }

    @PostMapping("/movie/{listId}/add")
    public Movie addMovie (@RequestBody Movie movie, @PathVariable Long listId) {
        if(!movieDao.existsByTmdbId(movie.getTmdbId())){
            movieDao.save(movie);
        } else {
            movie = movieDao.getByTmdbId(movie.getTmdbId());
        }
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MovieList list = listDao.getById(listId);

        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList){
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

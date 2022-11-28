package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Genre;
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

    private final MovieRepository movieDao;
    private final MovieListRepository listDao;
    private final GenreRepository genreDao;

    public MovieController(MovieRepository movieDao, MovieListRepository listDao, GenreRepository genreDao) {
        this.movieDao = movieDao;
        this.listDao = listDao;
        this.genreDao = genreDao;
    }

    private Boolean isMember(Set<User> listMembers, User user) {
        Boolean userIsMemberOfList = false;
        for(User listMember : listMembers) {
            if(user.getId() == listMember.getId()) userIsMemberOfList = true;
        }
        return userIsMemberOfList;
    }

    // Health check to see if rest actions are working
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
    public Movie addMovie(@RequestBody Movie movie, @PathVariable Long listId) {
        // Add movie to database if not already present, otherwise set equal to object in database
        System.out.println("Inside addMovie");
        if(!movieDao.existsByTmdbId(movie.getTmdbId())){
            movieDao.save(movie);
            for(Genre genre : movie.getGenres()) {
                String name = genre.getName();
                System.out.println(name);
                if(!genreDao.existsByName(name)) {
                    genre.getMovies().add(movie);
                    genreDao.save(genre);
                } else {
                    genreDao.findByName(name).getMovies().add(movie);
                }
            }
        } else {
            movie = movieDao.getByTmdbId(movie.getTmdbId());
        }
        User user = Utils.currentUser();
        MovieList list = listDao.getById(listId);
        // Checking if user is member of list to add movie
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList){
            list.getMovies().add(movie);
            listDao.save(list);
        }
        return movieDao.getByTmdbId(movie.getTmdbId());
    }

    @DeleteMapping("/movie/{movieId}/{listId}/delete")
    public void deleteMovie(@PathVariable Long movieId, @PathVariable Long listId) {
        User user = Utils.currentUser();
        Movie movie = movieDao.getById(movieId);
        MovieList list = listDao.getById(listId);
        Boolean userIsMemberOfList = isMember(list.getMembers(), user);
        if(userIsMemberOfList) {
            // Removing movie from list instead of deleting from database
            list.getMovies().remove(movie);
            listDao.save(list);
        }
    }
}

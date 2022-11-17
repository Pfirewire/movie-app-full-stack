package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Genre;
import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.repositories.GenreRepository;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class GenreController {

    private final GenreRepository genreDao;
    private final MovieRepository movieDao;

    public GenreController(GenreRepository genreDao, MovieRepository movieDao) {
        this.genreDao = genreDao;
        this.movieDao = movieDao;
    }

    @GetMapping("/genre/all")
    public Set<Genre> getAllGenres() {
        List<Genre> genreList = genreDao.findAll();
        Set<Genre> genres = new HashSet<>();
        genres.addAll(genreList);
        return genres;
    }

    @GetMapping("/genre/{movieId}")
    public Set<Genre> getGenreByMovieId(@PathVariable Long movieId) {
        Set<Genre> genres = genreDao.findAllByMovies(movieDao.findById(movieId).get());
        return genres;
    }

    @GetMapping("/genre/movies/{genreId}")
    public Set<Movie> getMoviesByGenres(@PathVariable Long genreId) {
        Set<Movie> movies = movieDao.findAllByGenres(genreDao.findById(genreId).get());
        return movies;
    }
}

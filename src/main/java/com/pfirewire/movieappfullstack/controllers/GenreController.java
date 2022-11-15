package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Genre;
import com.pfirewire.movieappfullstack.repositories.GenreRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class GenreController {

    private final GenreRepository genreDao;

    public GenreController(GenreRepository genreDao) {
        this.genreDao = genreDao;
    }

    @GetMapping("/genre/all")
    public Set<Genre> getAllGenres() {
        List<Genre> genreList = genreDao.findAll();
        Set<Genre> genres = new HashSet<>();
        genres.addAll(genreList);
        return genres;
    }
}

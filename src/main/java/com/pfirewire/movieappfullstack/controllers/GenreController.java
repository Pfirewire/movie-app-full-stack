package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.repositories.GenreRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GenreController {

    private final GenreRepository genreDao;

    public GenreController(GenreRepository genreDao) {
        this.genreDao = genreDao;
    }
}

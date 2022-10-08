package com.pfirewire.movieappfullstack.models;

import com.pfirewire.movieappfullstack.models.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.beans.factory.annotation.Value;

import javax.validation.*;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.List;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long tmdbId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String poster;

    @Column
    private int year;

    @Column
    private String genres;

    @Column(columnDefinition = "TEXT")
    private String plot;

    @ManyToMany(mappedBy="movies")
    private List<User> users;

    // Constructor functions
    public Movie() {}

    public Movie(Long tmdbId, String title) {
        this.tmdbId = tmdbId;
        this.title = title;
    }
}

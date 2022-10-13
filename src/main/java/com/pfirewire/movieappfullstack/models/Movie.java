package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.pfirewire.movieappfullstack.models.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Cascade;
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

    @Column(nullable = false)
    private Long tmdbId;

    @Column
    private String title;

    @Column(columnDefinition = "TEXT")
    private String poster;

    @Column
    private int year;

    @Column
    private String genre;

    @Column(columnDefinition = "TEXT")
    private String plot;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "lists_movies",
            joinColumns = {@JoinColumn(name = "movie_id")},
            inverseJoinColumns = {@JoinColumn(name = "list_id")}
    )
    private List<MovieList> lists;

    // Constructor functions
    public Movie() {
        super();
    }

    public Movie(Long tmdbId, String title) {
        this.tmdbId = tmdbId;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getPlot() {
        return plot;
    }

    public void setPlot(String plot) {
        this.plot = plot;
    }

    public List<MovieList> getLists() {
        return lists;
    }

    public void setLists(List<MovieList> lists) {
        this.lists = lists;
    }
}

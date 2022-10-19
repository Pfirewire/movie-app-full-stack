package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pfirewire.movieappfullstack.models.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Cascade;
import org.springframework.beans.factory.annotation.Value;

import javax.validation.*;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.List;
import java.util.Set;

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

    @ManyToMany(mappedBy = "movies")
//    @JsonManagedReference(value = "listMovies")
    @JsonIgnore
    private Set<MovieList> lists;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie")
//    @JsonManagedReference(value = "movieRating")
    @JsonIgnore
    private Set<Rating> ratings;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie")
//    @JsonManagedReference(value = "movieReview")
    @JsonIgnore
    private Set<Review> reviews;

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

    public Set<MovieList> getLists() {
        return lists;
    }

    public void setLists(Set<MovieList> lists) {
        this.lists = lists;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
    }

    public void removeReview(Review review) {
        this.reviews.remove(review);
    }
}

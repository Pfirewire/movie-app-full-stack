package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
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

    @ManyToMany(mappedBy = "movies")
//    @JsonManagedReference(value = "genresMovies")
    private Set<Genre> genres;

    @Column(columnDefinition = "TEXT")
    private String plot;

    @ManyToMany(mappedBy = "movies")
    @JsonManagedReference(value = "listMovies")
    @JsonIgnore
    private Set<MovieList> lists;

    @OneToMany(mappedBy = "movie")
    @JsonManagedReference(value = "movieRating")
    @JsonIgnore
    private Set<Rating> ratings;

    @OneToMany(mappedBy = "movie")
    @JsonManagedReference(value = "movieReview")
//    @JsonIgnore
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

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
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

package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int value;

    @ManyToOne
    @JsonBackReference(value = "userRating")
//    @JsonIgnore
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JsonBackReference(value = "movieRating")
//    @JsonIgnore
    @JoinColumn(name="movie_id")
    private Movie movie;

    public Rating() {}

    public Rating(int value) {
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}

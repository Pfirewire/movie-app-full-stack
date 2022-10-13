package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "lists")
public class MovieList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="owner_id")
    private User owner;

    @ManyToMany(mappedBy = "lists")
    private List<Movie> movies;

    @ManyToMany(mappedBy = "lists")
    private List<User> members;

    public MovieList() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembmers(List<User> members) {
        this.members = members;
    }

    public void addMovie(Movie movie) {
        this.movies.add(movie);
    }

    public void deleteMovie(Movie movie) {
        this.movies.remove(movie);
    }
}

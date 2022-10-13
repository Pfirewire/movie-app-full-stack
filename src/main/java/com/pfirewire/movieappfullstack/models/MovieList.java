package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "lists")
    private Set<Movie> movies;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "lists_users",
            joinColumns = {@JoinColumn(name = "list_id")},
            inverseJoinColumns = {@JoinColumn(name = "user_id")}
    )
    private Set<User> members;

    public MovieList() {
        this.movies = new HashSet<>();
        this.members = new HashSet<>();
    }

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Movie> getMovies() {
        return movies;
    }

    public void setMovies(Set<Movie> movies) {
        this.movies = movies;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    public void addMovie(Movie movie) {
        this.movies.add(movie);
    }

    public void deleteMovie(Movie movie) {
        this.movies.remove(movie);
    }

    public void addMember(User user) {
        System.out.println("adding member to a list. user id is: ");
        System.out.println(user.getId());
        this.members.add(user);
        System.out.println("member has been added. new member list: ");
        System.out.println(this.members.toString());
    }

    public void deleteMember(User user) {
        this.members.remove(user);
    }
}

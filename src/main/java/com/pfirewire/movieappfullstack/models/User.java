package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    // All private variables, attached to users table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "owner")
    @JsonManagedReference
    private List<MovieList> listsOwned;

    @ManyToMany(mappedBy = "members")
    private Set<MovieList> lists = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonManagedReference(value = "userRating")
    private Set<Rating> ratings = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonManagedReference(value = "userReview")
    private Set<Review> reviews = new HashSet<>();
    // Constructor functions
    public User () {
    }
    public User (String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User (User copy) {
        this.id = copy.id;
        this.email = copy.email;
        this.username = copy.username;
        this.password = copy.password;
//        this.lists = copy.lists;
//        this.ratings = copy.ratings;
//        this.reviews = copy.reviews;
    }


    // Getters and Setters
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail () { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername () { return this.username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword () { return this.password; }
    public void setPassword(String password) { this.password = password; }

    public List<MovieList> getListsOwned() {
        return listsOwned;
    }

    public void setListsOwned(List<MovieList> listsOwned) {
        this.listsOwned = listsOwned;
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

    public void addList(MovieList list) {
        this.lists.add(list);
    }
}

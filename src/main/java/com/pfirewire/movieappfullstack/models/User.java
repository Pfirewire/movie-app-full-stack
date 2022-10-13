package com.pfirewire.movieappfullstack.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.List;

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

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "lists_users",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "list_id")}
    )
    private List<MovieList> lists;
    // Constructor functions
    public User () {}
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

    public List<MovieList> getLists() {
        return lists;
    }

    public void setLists(List<MovieList> lists) {
        this.lists = lists;
    }
}

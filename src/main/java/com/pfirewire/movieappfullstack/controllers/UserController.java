package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {

    // Repositories and Services
    private UserRepository userDao;
//    private MovieRepository movieDao;
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Url url;

    // Constructor
    public UserController(UserRepository userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
//        this.movieDao = movieDao;
        this.passwordEncoder = passwordEncoder;
    }

    // Shows form to sign up as a user
    @GetMapping("/signup")
    public String showSignupForm(Model model) {
        // Sending empty user to template
        model.addAttribute("user", new User());
        return "user/signup";
    }

    // Saves user to users table
    @PostMapping("/signup")
    public String saveUser(@ModelAttribute User user) {
        // Hashing password
        String hash = passwordEncoder.encode(user.getPassword());
        // Setting user password to the hash and saving user to table
        user.setPassword(hash);
        userDao.save(user);
        return "redirect:/login";
    }

    @GetMapping("/movie/list/1")
    public String showMyMoviesIndex(Model model) {
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }

    @GetMapping("/movie/list")
    public String showMovieLists(Model model) {
        return "movie/list/movie-lists";
    }

    @GetMapping("/reviews")
    public String showMovieReviews() {
        return "movie/reviews";
    }
}

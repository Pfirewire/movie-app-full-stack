package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@Controller
public class UserController {

    // Repositories and Services
    private UserRepository userDao;
    private MovieListRepository listDao;
//    private MovieRepository movieDao;
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Url url;

    // Constructor
    public UserController(UserRepository userDao, MovieListRepository listDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.listDao = listDao;
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

    @GetMapping("/movie/list/5")
    public String showMyMoviesIndex(Model model) {
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }

    @GetMapping("/movie/list")
    public String showMovieLists(Model model) {
        model.addAttribute("url", url);
        model.addAttribute("list", new MovieList());
        return "movie/list/movie-lists";
    }

    @PostMapping("/movie/list")
    public String saveMovieList(@ModelAttribute MovieList list, Model model) {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        listDao.save(list);
        list.setOwner(user);
        list.getMembers().add(user);
        listDao.save(list);
        model.addAttribute("list", list);
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }

    @GetMapping("/reviews")
    public String showMovieReviews() {
        return "movie/reviews";
    }

    @GetMapping("movie/list/{listId}")
    public String showMovieList(@PathVariable Long listId, Model model) {
        MovieList list = listDao.getById(listId);
        model.addAttribute("list", list);
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }
}

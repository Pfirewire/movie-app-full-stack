package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MovieListController {

    private UserRepository userDao;
    private MovieRepository movieDao;
    private MovieListRepository listDao;
    @Autowired
    private Url url;

    public MovieListController(UserRepository userDao, MovieRepository movieDao, MovieListRepository movieListDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.listDao = listDao;
    }

    @GetMapping("/movie/list")
    public String showMovieLists(Model model) {
        model.addAttribute("url", url);
        model.addAttribute("list", new MovieList());
        return "movie/list/movie-lists";
    }

    @PostMapping("/movie/list")
    public String saveMovieList(@ModelAttribute MovieList list, Model model) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        listDao.save(list);
        list.setOwner(user);
        list.getMembers().add(user);
        listDao.save(list);
        model.addAttribute("list", list);
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }

    @GetMapping("movie/list/{listId}")
    public String showMovieList(@PathVariable Long listId, Model model) {
        MovieList list = listDao.getById(listId);
        model.addAttribute("list", list);
        model.addAttribute("url", url);
        return "movie/list/my-movies";
    }
}
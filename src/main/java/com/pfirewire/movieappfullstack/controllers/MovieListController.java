package com.pfirewire.movieappfullstack.controllers;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.MovieListRepository;
import com.pfirewire.movieappfullstack.repositories.MovieRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.services.Url;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@Controller
public class MovieListController {

    private UserRepository userDao;
    private MovieRepository movieDao;
    private MovieListRepository listDao;
    @Autowired
    private Url url;

    public MovieListController(UserRepository userDao, MovieRepository movieDao, MovieListRepository listDao) {
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.listDao = listDao;
    }


    @GetMapping("/movie/list/all")

    public @ResponseBody Set<MovieList> getAllMovieLists() {
        User user = Utils.currentUser();
        Set<MovieList> userMovieLists = listDao.findAllByMembers(user);
        return userMovieLists;
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

    @GetMapping("movie/list/{listId}/get")
    public @ResponseBody MovieList getMovieList(@PathVariable Long listId) {
        MovieList list = listDao.getById(listId);
        return list;
    }

    // Probably don't even need this method
    @GetMapping("movie/list/{listId}/edit")
    public String showEditMovieListForm(@PathVariable Long listId, Model model) {
        MovieList list = listDao.getById(listId);
        model.addAttribute("list", list);
        return "movie/list/edit";
    }

    @PostMapping("movie/list/{listId}/edit")
    public String editMovieList(@PathVariable Long listId, @RequestBody MovieList newList) {
        MovieList oldList = listDao.getById(listId);
        oldList.setName(newList.getName());
        listDao.save(oldList);
        return "movie/list/movie-lists";
    }

    @DeleteMapping("movie/list/{listId}/delete")
    public @ResponseBody MovieList deleteMovieList(@PathVariable Long listId) {
        System.out.println("Inside deleteMovieList.");
        MovieList list = listDao.getById(listId);
        System.out.println("Created list with listRepository.");
        listDao.deleteById(listId);
        System.out.println("Deleted list.");
        return list;
    }
}

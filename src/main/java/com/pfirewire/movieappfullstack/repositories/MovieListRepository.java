package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.MovieList;
import com.pfirewire.movieappfullstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    Set<MovieList> findAllByMembers(User user);
}

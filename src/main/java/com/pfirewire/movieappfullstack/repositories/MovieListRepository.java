package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.MovieList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieListRepository extends JpaRepository<MovieList, Long> {
}

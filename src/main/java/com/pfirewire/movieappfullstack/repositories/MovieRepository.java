package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie findByTitle(String title);
}
package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie getByTmdbId(Long tmdbId);
    Boolean existsByTmdbId(Long tmdbId);
}

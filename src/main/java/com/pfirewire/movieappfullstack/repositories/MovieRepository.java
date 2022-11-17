package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Genre;
import com.pfirewire.movieappfullstack.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie getByTmdbId(Long tmdbId);
    Boolean existsByTmdbId(Long tmdbId);

    Set<Movie> findAllByGenres(Genre genre);
}

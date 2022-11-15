package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Genre;
import com.pfirewire.movieappfullstack.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
//    Set<Genre> findAllByMovie(Movie movie);
    boolean existsByName(String name);
}

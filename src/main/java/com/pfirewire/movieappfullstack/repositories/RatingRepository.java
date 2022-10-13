package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Movie;
import com.pfirewire.movieappfullstack.models.Rating;
import com.pfirewire.movieappfullstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByUserAndMovie(User user, Movie movie);
}

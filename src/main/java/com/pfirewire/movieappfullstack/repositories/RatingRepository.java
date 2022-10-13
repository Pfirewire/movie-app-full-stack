package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}

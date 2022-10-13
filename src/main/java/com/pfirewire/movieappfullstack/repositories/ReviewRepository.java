package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}

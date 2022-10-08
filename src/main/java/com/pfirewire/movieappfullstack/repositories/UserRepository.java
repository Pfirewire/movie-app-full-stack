package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

package com.pfirewire.movieappfullstack.repositories;

import com.pfirewire.movieappfullstack.models.ProfilePicture;
import com.pfirewire.movieappfullstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, Long> {
    ProfilePicture findByUser(User user);
}

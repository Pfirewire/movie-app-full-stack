package com.pfirewire.movieappfullstack.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pfirewire.movieappfullstack.models.ProfilePicture;
import com.pfirewire.movieappfullstack.models.User;
import com.pfirewire.movieappfullstack.repositories.ProfilePictureRepository;
import com.pfirewire.movieappfullstack.repositories.UserRepository;
import com.pfirewire.movieappfullstack.utils.Utils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfilePictureController {

    private final UserRepository userDao;

    private final ProfilePictureRepository profilePictureDao;

    public ProfilePictureController(UserRepository userDao, ProfilePictureRepository profilePictureDao) {
        this.userDao = userDao;
        this.profilePictureDao = profilePictureDao;
    }

    @GetMapping("/user/picture")
    public ProfilePicture getProfilePicture() throws JsonProcessingException {
        if(Utils.currentUser() == null) {
            return new ProfilePicture(-1L);
        } else {
            return profilePictureDao.findByUser(userDao.findById(Utils.currentUser().getId()).get());
        }
    }

    @PostMapping("/user/picture")
    public ProfilePicture setProfilePicture(@RequestBody ProfilePicture picture) throws JsonProcessingException {
        User user = userDao.findById(Utils.currentUser().getId()).get();
        ProfilePicture currentPicture = profilePictureDao.findByUser(user);
        if(currentPicture != null) {
            profilePictureDao.delete(currentPicture);
        }
        picture.setUser(user);
        profilePictureDao.save(picture);
        return picture;
    }
}

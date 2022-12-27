package com.pfirewire.movieappfullstack.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public ProfilePicture getProfilePicture() {
        return profilePictureDao.findByUser(userDao.findById(Utils.currentUser().getId()).get());
    }

    @PostMapping("/user/picture")
    public ProfilePicture setProfilePicture(@RequestBody ProfilePicture picture) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("inside setProfilePicture");
        User user = userDao.findById(Utils.currentUser().getId()).get();
        System.out.println("user: ");
        System.out.println(mapper.writeValueAsString(user));
        ProfilePicture currentPicture = profilePictureDao.findByUser(user);
        System.out.println("current picture: ");
        System.out.println(mapper.writeValueAsString(currentPicture));
        if(currentPicture != null) {
            System.out.println("inside if statement to delete current picture");
            profilePictureDao.delete(currentPicture);
        }
        picture.setUser(user);
        System.out.println("picture to save:");
        System.out.println(mapper.writeValueAsString(picture));
        profilePictureDao.save(picture);
        return picture;
    }
}

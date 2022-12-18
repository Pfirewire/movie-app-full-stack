package com.pfirewire.movieappfullstack.config;

import com.pfirewire.movieappfullstack.models.PasswordReset;
import com.pfirewire.movieappfullstack.repositories.PasswordResetRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Configuration
@EnableScheduling
public class SchedulerConfiguration {
    private PasswordResetRepository passwordResetDao;

    public SchedulerConfiguration(PasswordResetRepository passwordResetDao) {
        this.passwordResetDao = passwordResetDao;
    }

//    @Scheduled(cron = "0 0 0 ? * * *")
    @Scheduled(fixedRate = 10000)
    public void clearPasswordResetTable() {
        System.out.println("Scheduled event. Clearing password reset tokens");
        List<PasswordReset> pwTokens = passwordResetDao.findAll();
        List<PasswordReset> pwTokensToDelete = new ArrayList<>();
        for(PasswordReset pwToken : pwTokens) {
            if(new Date().getTime() > pwToken.getExpirationDate().getTime()) {
                pwTokensToDelete.add(passwordResetDao.findByToken(pwToken.getToken()));
            }
        }
        passwordResetDao.deleteAllInBatch(pwTokensToDelete);
    }
}

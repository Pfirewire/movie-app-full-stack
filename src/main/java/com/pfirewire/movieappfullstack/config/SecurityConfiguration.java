package com.pfirewire.movieappfullstack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// Security configuration for application
@Configuration
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
//            .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                // Login configuration
//            .and()
                .formLogin()
                .loginPage("/login")
                .defaultSuccessUrl("/")
                .permitAll()
                // Logout configuration
                .and()
                .logout()
                .logoutSuccessUrl("/login?logout")
                // Pages only viewable when logged in
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/movie/list/*",
                        "/movies",
                        "/movie/list",
                        "/review/user/view"
                )
                .authenticated()
                // Pages viewable without logging in
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/index",
                        "/reviews",
                        "/review/all/view"
                )
                .permitAll()
        ;
        return http.build();
    }
}

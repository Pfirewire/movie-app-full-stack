package com.pfirewire.movieappfullstack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// Security configuration for application
@Configuration
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("https://pfirewire.com", "https://www.pfirewire.com"));
//        configuration.setAllowedMethods(Arrays.asList("*"));
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
//                .cors().configurationSource(corsConfigurationSource())
//            .and()
//            .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()
//            .and()
                // Login configuration
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
                        "/review/user/view",
                        "/profile"
                )
                .authenticated()
                // Pages viewable without logging in
            .and()
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/index",
                        "/reviews",
                        "/review/all/view",
                        "/pwreset"
                )
                .permitAll()
        ;
        return http.build();
    }
}

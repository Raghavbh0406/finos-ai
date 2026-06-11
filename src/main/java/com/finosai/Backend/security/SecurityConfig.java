package com.finosai.Backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

private final JwtAuthenticationFilter jwtFilter;

public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
    this.jwtFilter = jwtFilter;
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {

    http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    ))

            .authorizeHttpRequests(auth -> auth

                    .requestMatchers(

                            "/",
                            "/login-page",
                            "/register",

                            "/dashboard-page",
                            "/income-page",
                            "/expenses-page",
                            "/budgets-page",
                            "/investments-page",
                            "/savings-page",

                            "/profile-page",
                            "/change-password-page",

                            "/sip-calculator-page",
                            "/loan-calculator-page",
                            "/tax-calculator-page",
                            "/retirement-calculator-page",

                            "/css/**",
                            "/js/**",

                            "/api/users",
                            "/api/users/login",

                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs/**"

                    ).permitAll()

                    .anyRequest()
                    .authenticated()
            )

            .httpBasic(httpBasic -> httpBasic.disable())

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

    return http.build();
}
}
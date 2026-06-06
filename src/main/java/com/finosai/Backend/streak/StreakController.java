package com.finosai.Backend.streak;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/streak")
public class StreakController {

    private final StreakService streakService;

    public StreakController(
            StreakService streakService) {

        this.streakService = streakService;
    }

    @GetMapping
    public StreakResponse getStreak(
            Authentication authentication) {

        return streakService.getCurrentStreak(
                authentication.getName()
        );
    }
}
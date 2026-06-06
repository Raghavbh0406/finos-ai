package com.finosai.Backend.savings;

import com.finosai.Backend.savings.dto.SavingsGoalRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService service;

    public SavingsGoalController(
            SavingsGoalService service) {

        this.service = service;
    }

    @PostMapping
    public SavingsGoal createGoal(
            @RequestBody SavingsGoalRequest request,
            Authentication authentication) {

        return service.createGoal(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<SavingsGoal> getMyGoals(
            Authentication authentication) {

        return service.getGoalsByUser(
                authentication.getName()
        );
    }
}
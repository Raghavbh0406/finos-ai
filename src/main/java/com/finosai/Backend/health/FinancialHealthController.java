package com.finosai.Backend.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financial-health")
public class FinancialHealthController {

    private final FinancialHealthService service;

    public FinancialHealthController(
            FinancialHealthService service) {

        this.service = service;
    }

    @GetMapping
    public FinancialHealthResponse getHealthScore() {

        return service.calculateHealthScore();
    }
}
package com.finosai.Backend.portfolio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService service;

    public PortfolioController(
            PortfolioService service) {

        this.service = service;
    }

    @GetMapping
    public PortfolioResponse getPortfolioAnalytics() {

        return service.getPortfolioAnalytics();
    }
}
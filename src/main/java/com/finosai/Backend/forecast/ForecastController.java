package com.finosai.Backend.forecast;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService service;

    public ForecastController(
            ForecastService service) {

        this.service = service;
    }

    @GetMapping
    public ForecastResponse getForecast() {

        return service.getForecast();
    }
}
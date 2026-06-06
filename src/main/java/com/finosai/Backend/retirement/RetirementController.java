package com.finosai.Backend.retirement;

import com.finosai.Backend.retirement.dto.RetirementRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/retirement")
public class RetirementController {

    private final RetirementService service;

    public RetirementController(
            RetirementService service) {

        this.service = service;
    }

    @PostMapping("/calculate")
    public RetirementResponse calculate(
            @RequestBody RetirementRequest request) {

        return service.calculate(
                request
        );
    }
}
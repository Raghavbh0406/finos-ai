package com.finosai.Backend.insurance;

import com.finosai.Backend.insurance.dto.InsuranceRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insurance")
public class InsuranceController {

    private final InsuranceService service;

    public InsuranceController(
            InsuranceService service) {

        this.service = service;
    }

    @PostMapping("/plan")
    public InsuranceResponse calculate(
            @RequestBody InsuranceRequest request) {

        return service.calculate(
                request
        );
    }
}
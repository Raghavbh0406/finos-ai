package com.finosai.Backend.capitalgains;

import com.finosai.Backend.capitalgains.dto.CapitalGainsRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/capital-gains")
public class CapitalGainsController {

    private final CapitalGainsService service;

    public CapitalGainsController(
            CapitalGainsService service) {

        this.service = service;
    }

    @PostMapping("/calculate")
    public CapitalGainsResponse calculate(
            @RequestBody CapitalGainsRequest request) {

        return service.calculate(request);
    }
}
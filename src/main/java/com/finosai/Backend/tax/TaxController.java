package com.finosai.Backend.tax;

import com.finosai.Backend.tax.dto.TaxRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tax")
public class TaxController {

    private final TaxService taxService;

    public TaxController(
            TaxService taxService) {

        this.taxService = taxService;
    }

    @PostMapping("/calculate")
    public TaxResponse calculateTax(
            @RequestBody TaxRequest request) {

        return taxService.calculateTax(
                request
        );
    }
}
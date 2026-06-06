package com.finosai.Backend.taxadvisor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tax-advisor")
public class TaxAdvisorController {

    private final TaxAdvisorService taxAdvisorService;

    public TaxAdvisorController(
            TaxAdvisorService taxAdvisorService) {

        this.taxAdvisorService = taxAdvisorService;
    }

    @GetMapping
    public TaxAdviceResponse getAdvice(
            @RequestParam Double annualIncome) {

        return taxAdvisorService.getAdvice(
                annualIncome
        );
    }
}
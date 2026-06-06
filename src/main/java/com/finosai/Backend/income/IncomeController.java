package com.finosai.Backend.income;

import com.finosai.Backend.income.dto.IncomeRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService service;

    public IncomeController(
            IncomeService service) {

        this.service = service;
    }

    @PostMapping
    public Income createIncome(
            @RequestBody IncomeRequest request,
            Authentication authentication) {

        return service.createIncome(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Income> getMyIncome(
            Authentication authentication) {

        return service.getIncomeByUser(
                authentication.getName()
        );
    }
}
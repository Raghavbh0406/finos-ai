package com.finosai.Backend.investment;

import com.finosai.Backend.investment.dto.InvestmentRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    private final InvestmentService service;

    public InvestmentController(
            InvestmentService service) {

        this.service = service;
    }

    @PostMapping
    public Investment createInvestment(
            @RequestBody InvestmentRequest request,
            Authentication authentication) {

        return service.createInvestment(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Investment> getMyInvestments(
            Authentication authentication) {

        return service.getInvestmentsByUser(
                authentication.getName()
        );
    }
}
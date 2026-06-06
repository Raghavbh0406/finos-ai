package com.finosai.Backend.loan;

import com.finosai.Backend.loan.dto.LoanRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    private final LoanService service;

    public LoanController(
            LoanService service) {

        this.service = service;
    }

    @PostMapping("/calculate")
    public LoanResponse calculate(
            @RequestBody LoanRequest request) {

        return service.calculate(
                request
        );
    }
}
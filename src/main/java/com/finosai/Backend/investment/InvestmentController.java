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

@GetMapping("/{id}")
public Investment getInvestmentById(
        @PathVariable Long id) {

    return service.getInvestmentById(id);
}

@PutMapping("/{id}")
public Investment updateInvestment(
        @PathVariable Long id,
        @RequestBody InvestmentRequest request) {

    return service.updateInvestment(
            id,
            request
    );
}

@DeleteMapping("/{id}")
public void deleteInvestment(
        @PathVariable Long id) {

    service.deleteInvestment(id);
}


}

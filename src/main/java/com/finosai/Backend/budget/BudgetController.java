package com.finosai.Backend.budget;

import com.finosai.Backend.budget.dto.BudgetRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {


private final BudgetService budgetService;

public BudgetController(
        BudgetService budgetService) {

    this.budgetService = budgetService;
}

@PostMapping
public Budget createBudget(
        @RequestBody BudgetRequest request,
        Authentication authentication) {

    return budgetService.createBudget(
            request,
            authentication.getName()
    );
}

@GetMapping
public List<Budget> getMyBudgets(
        Authentication authentication) {

    return budgetService.getBudgetsByUser(
            authentication.getName()
    );
}

@GetMapping("/{id}")
public Budget getBudgetById(
        @PathVariable Long id) {

    return budgetService.getBudgetById(id);
}

@PutMapping("/{id}")
public Budget updateBudget(
        @PathVariable Long id,
        @RequestBody BudgetRequest request) {

    return budgetService.updateBudget(
            id,
            request
    );
}

@DeleteMapping("/{id}")
public void deleteBudget(
        @PathVariable Long id) {

    budgetService.deleteBudget(id);
}


}

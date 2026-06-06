package com.finosai.Backend.expense;

import com.finosai.Backend.expense.dto.ExpenseRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(
            ExpenseService expenseService) {

        this.expenseService = expenseService;
    }

    @PostMapping
    public Expense createExpense(
            @RequestBody ExpenseRequest request,
            Authentication authentication) {

        return expenseService.createExpense(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Expense> getMyExpenses(
            Authentication authentication) {

        return expenseService.getExpensesByUser(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public Expense getExpenseById(
            @PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);
    }

    @GetMapping("/total")
    public Double getTotalExpenses(
            Authentication authentication) {

        return expenseService.getTotalExpenses(
                authentication.getName()
        );
    }
}
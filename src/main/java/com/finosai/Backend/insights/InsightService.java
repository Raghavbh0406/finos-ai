package com.finosai.Backend.insights;

import com.finosai.Backend.budget.Budget;
import com.finosai.Backend.budget.BudgetRepository;
import com.finosai.Backend.expense.Expense;
import com.finosai.Backend.expense.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InsightService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public InsightService(
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository) {

        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public InsightResponse getInsights() {

        List<Expense> expenses = expenseRepository.findAll();

        if (expenses.isEmpty()) {
            return new InsightResponse(
                    "No expenses found. Start tracking expenses to receive insights."
            );
        }

        String category = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ))
                .entrySet()
                .stream()
                .max((a, b) -> Double.compare(a.getValue(), b.getValue()))
                .get()
                .getKey();

        double spent = expenses.stream()
                .filter(e -> e.getCategory().equals(category))
                .mapToDouble(Expense::getAmount)
                .sum();

        Optional<Budget> budgetOptional =
                budgetRepository.findByCategory(category);

        if (budgetOptional.isPresent()) {

            Budget budget = budgetOptional.get();

            double limit = budget.getLimitAmount();
            double remaining = limit - spent;
            double usage = (spent / limit) * 100;

            return new InsightResponse(
                    String.format(
                            "You have spent ₹%.2f out of your ₹%.2f %s budget. ₹%.2f remaining (%.1f%% used).",
                            spent,
                            limit,
                            category,
                            remaining,
                            usage
                    )
            );
        }

        return new InsightResponse(
                String.format(
                        "%s expenses account for the largest share of your spending.",
                        category
                )
        );
    }
}
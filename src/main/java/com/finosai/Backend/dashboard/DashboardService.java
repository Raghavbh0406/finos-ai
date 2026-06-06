package com.finosai.Backend.dashboard;

import com.finosai.Backend.expense.Expense;
import com.finosai.Backend.expense.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;

    public DashboardService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public DashboardResponse getDashboard() {

        List<Expense> expenses =
                expenseRepository.findAll();

        double total = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        long count = expenses.size();

        double average =
                count == 0 ? 0 : total / count;

        double highest = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .max()
                .orElse(0);

        return new DashboardResponse(
                total,
                count,
                average,
                highest
        );
    }
}
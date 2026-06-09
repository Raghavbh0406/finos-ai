package com.finosai.Backend.report;

import com.finosai.Backend.budget.Budget;
import com.finosai.Backend.budget.BudgetRepository;
import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.Expense;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.streak.StreakResponse;
import com.finosai.Backend.streak.StreakService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeeklyReportService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final StreakService streakService;

    public WeeklyReportService(
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            StreakService streakService) {

        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.streakService = streakService;
    }

    public void sendWeeklyReports() {

        List<User> users = userRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();

        double totalSpent = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        double highestExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .max()
                .orElse(0);

        StreakResponse streak = new StreakResponse(0);

        Optional<Budget> budget = budgetRepository.findAll()
                .stream()
                .findFirst();

        double budgetUsage = 0;

        if (budget.isPresent()) {
            budgetUsage = (totalSpent / budget.get().getLimitAmount()) * 100;
        }

        for (User user : users) {
            System.out.println(
                "WEEKLY REPORT for " + user.getEmail()
                + " | Total Spent: " + totalSpent
                + " | Highest: " + highestExpense
                + " | Budget Usage: " + String.format("%.1f", budgetUsage) + "%"
                + " | Streak: " + streak.getCurrentStreak() + " days"
            );
        }
    }
}
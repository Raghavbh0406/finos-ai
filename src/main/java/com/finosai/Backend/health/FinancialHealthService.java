package com.finosai.Backend.health;

import com.finosai.Backend.budget.BudgetRepository;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.investment.InvestmentRepository;
import com.finosai.Backend.savings.SavingsGoalRepository;
import com.finosai.Backend.streak.StreakService;
import com.finosai.Backend.streak.StreakResponse;
import org.springframework.stereotype.Service;

@Service
public class FinancialHealthService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final InvestmentRepository investmentRepository;
    private final StreakService streakService;

    public FinancialHealthService(
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            SavingsGoalRepository savingsGoalRepository,
            InvestmentRepository investmentRepository,
            StreakService streakService) {

        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.investmentRepository = investmentRepository;
        this.streakService = streakService;
    }

    public FinancialHealthResponse calculateHealthScore() {

        int score = 0;

        if (expenseRepository.count() > 0) {
            score += 20;
        }

        if (budgetRepository.count() > 0) {
            score += 20;
        }

        if (savingsGoalRepository.count() > 0) {
            score += 20;
        }

        if (investmentRepository.count() > 0) {
            score += 20;
        }

        StreakResponse streak =
        new StreakResponse(0);

        if (streak.getCurrentStreak() >= 7) {
            score += 20;
        } else if (streak.getCurrentStreak() >= 3) {
            score += 10;
        }
        
        String rating;

        if (score >= 90) {
            rating = "Excellent";
        } else if (score >= 70) {
            rating = "Good";
        } else if (score >= 50) {
            rating = "Average";
        } else {
            rating = "Needs Improvement";
        }

        return new FinancialHealthResponse(
                score,
                rating
        );
    }
}
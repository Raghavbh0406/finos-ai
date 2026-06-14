package com.finosai.Backend.forecast;

import com.finosai.Backend.expense.Expense;
import com.finosai.Backend.expense.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ForecastService {

    private final ExpenseRepository expenseRepository;

    public ForecastService(
            ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ForecastResponse getForecast() {

        List<Expense> expenses =
                expenseRepository.findAll();

        LocalDate now = LocalDate.now();

        double currentMonthSpent =
                expenses.stream()
                        .filter(e -> e.getDate() != null &&
                                e.getDate().getMonth()
                                        .equals(now.getMonth()) &&
                                e.getDate().getYear() == now.getYear())
                        .mapToDouble(Expense::getAmount)
                        .sum();

        int currentDay = now.getDayOfMonth();

        double forecastedSpend = 0;

        if (currentDay > 0) {
            forecastedSpend =
                    (currentMonthSpent / currentDay) * 30;
        }

        return new ForecastResponse(
                currentMonthSpent,
                forecastedSpend
        );
    }
}
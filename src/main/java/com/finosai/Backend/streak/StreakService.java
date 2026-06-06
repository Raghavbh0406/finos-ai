package com.finosai.Backend.streak;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.Expense;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StreakService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public StreakService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public StreakResponse getCurrentStreak(
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            return new StreakResponse(0);
        }

        List<LocalDate> dates =
                expenseRepository.findByUser(user)
                        .stream()
                        .map(Expense::getDate)
                        .distinct()
                        .sorted(Comparator.reverseOrder())
                        .collect(Collectors.toList());

        if (dates.isEmpty()) {
            return new StreakResponse(0);
        }

        int streak = 0;

        LocalDate expectedDate =
                LocalDate.now();

        if (!dates.contains(expectedDate)) {
            expectedDate =
                    LocalDate.now()
                            .minusDays(1);
        }

        for (LocalDate date : dates) {

            if (date.equals(expectedDate)) {

                streak++;

                expectedDate =
                        expectedDate.minusDays(1);

            } else if (date.isBefore(expectedDate)) {

                break;
            }
        }

        return new StreakResponse(streak);
    }
}
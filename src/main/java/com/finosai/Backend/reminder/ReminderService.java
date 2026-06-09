package com.finosai.Backend.reminder;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public ReminderService(
            UserRepository userRepository,
            ExpenseRepository expenseRepository) {

        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    public void sendDailyReminders() {

        List<User> users = userRepository.findAll();
        LocalDate today = LocalDate.now();

        for (User user : users) {

            boolean hasExpenseToday =
                    !expenseRepository
                            .findByUserAndDate(user, today)
                            .isEmpty();

            if (hasExpenseToday) continue;

            System.out.println(
                "DAILY REMINDER: " + user.getEmail()
                + " has not logged expenses today."
            );
        }
    }

    public void sendTestEmail(String email) {
        System.out.println("TEST REMINDER for: " + email);
    }
}

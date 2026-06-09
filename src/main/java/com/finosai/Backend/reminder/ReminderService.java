package com.finosai.Backend.reminder;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.service.EmailService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public ReminderService(
            EmailService emailService,
            UserRepository userRepository,
            ExpenseRepository expenseRepository) {

        this.emailService = emailService;
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

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    "Hi " + user.getName()
                            + ", you have not logged any expenses today. "
                            + "Open FinOS AI and keep your financial tracking streak alive. - FinOS AI Team"
            );
        }
    }

    public void sendTestEmail(String email) {

        emailService.sendPasswordResetEmail(
                email,
                "Congratulations! Your FinOS AI reminder system is working."
        );
    }
}
package com.finosai.Backend.reminder;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.ExpenseRepository;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public ReminderService(
            JavaMailSender mailSender,
            UserRepository userRepository,
            ExpenseRepository expenseRepository) {

        this.mailSender = mailSender;
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

            if (hasExpenseToday) {
                continue;
            }

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(user.getEmail());

            message.setSubject(
                    "FinOS AI - Daily Expense Reminder");

            message.setText(
                    "Hi " + user.getName() +
                    ",\n\nYou have not logged any expenses today.\n\n" +
                    "Open FinOS AI and keep your financial tracking streak alive.\n\n" +
                    "- FinOS AI Team"
            );

            mailSender.send(message);
        }
    }

    public void sendTestEmail(String email) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "FinOS AI Test Email");

        message.setText(
                "Congratulations!\n\n" +
                "Your FinOS AI reminder system is working."
        );

        mailSender.send(message);
    }
}
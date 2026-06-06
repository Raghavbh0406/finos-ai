package com.finosai.Backend.subscription.reminder;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.subscription.Subscription;
import com.finosai.Backend.subscription.SubscriptionRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionReminderService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public SubscriptionReminderService(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            JavaMailSender mailSender) {

        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public void sendRenewalReminders() {

        LocalDate tomorrow =
                LocalDate.now().plusDays(1);

        List<Subscription> subscriptions =
                subscriptionRepository.findByNextBillingDate(
                        tomorrow
                );

        if (subscriptions.isEmpty()) {
            return;
        }

        List<User> users =
                userRepository.findAll();

        for (Subscription subscription : subscriptions) {

            for (User user : users) {

                SimpleMailMessage mail =
                        new SimpleMailMessage();

                mail.setTo(user.getEmail());

                mail.setSubject(
                        "Subscription Renewal Reminder");

                mail.setText(
                        "Hi " + user.getName() +
                        ",\n\nYour " +
                        subscription.getName() +
                        " subscription of ₹" +
                        subscription.getAmount() +
                        " renews tomorrow.\n\n" +
                        "Please ensure sufficient balance.\n\n" +
                        "- FinOS AI"
                );

                mailSender.send(mail);
            }
        }
    }
}
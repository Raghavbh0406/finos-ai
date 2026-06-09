package com.finosai.Backend.subscription.reminder;

import com.finosai.Backend.service.EmailService;
import com.finosai.Backend.subscription.Subscription;
import com.finosai.Backend.subscription.SubscriptionRepository;
import com.finosai.Backend.user.User;
import com.finosai.Backend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionReminderService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public SubscriptionReminderService(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void sendRenewalReminders() {

        List<Subscription> subscriptions =
                subscriptionRepository.findAll();

        List<User> users = userRepository.findAll();

        for (Subscription subscription : subscriptions) {
            for (User user : users) {

                emailService.sendPasswordResetEmail(
                        user.getEmail(),
                        "Hi " + user.getName()
                                + ", your " + subscription.getName()
                                + " subscription of Rs." + subscription.getAmount()
                                + " renews tomorrow. Please ensure sufficient balance. - FinOS AI"
                );
            }
        }
    }
}
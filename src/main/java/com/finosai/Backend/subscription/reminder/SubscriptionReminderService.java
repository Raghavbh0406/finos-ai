package com.finosai.Backend.subscription.reminder;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.subscription.Subscription;
import com.finosai.Backend.subscription.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionReminderService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionReminderService(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository) {

        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    public void sendRenewalReminders() {

        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<User> users = userRepository.findAll();

        for (Subscription subscription : subscriptions) {
            for (User user : users) {
                System.out.println(
                    "SUBSCRIPTION REMINDER: " + user.getEmail()
                    + " | " + subscription.getName()
                    + " renews tomorrow | Amount: " + subscription.getAmount()
                );
            }
        }
    }
}
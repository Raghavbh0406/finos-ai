package com.finosai.Backend.subscription.reminder;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionReminderScheduler {

    private final SubscriptionReminderService service;

    public SubscriptionReminderScheduler(
            SubscriptionReminderService service) {

        this.service = service;
    }

    @Scheduled(cron = "0 0 10 * * ?")
    public void runDailyReminder() {

        service.sendRenewalReminders();

        System.out.println(
                "Subscription renewal reminder check completed."
        );
    }
}
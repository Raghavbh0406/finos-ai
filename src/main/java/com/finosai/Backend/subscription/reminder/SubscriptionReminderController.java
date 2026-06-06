package com.finosai.Backend.subscription.reminder;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscription-reminders")
public class SubscriptionReminderController {

    private final SubscriptionReminderService service;

    public SubscriptionReminderController(
            SubscriptionReminderService service) {

        this.service = service;
    }

    @GetMapping("/test")
    public String testReminder() {

        service.sendRenewalReminders();

        return "Subscription reminder process completed.";
    }
}
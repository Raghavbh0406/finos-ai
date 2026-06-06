package com.finosai.Backend.reminder;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    private final ReminderService reminderService;

    public ReminderScheduler(
            ReminderService reminderService) {

        this.reminderService = reminderService;
    }

    @Scheduled(cron = "0 0 20 * * ?")
    public void sendReminders() {

        reminderService.sendDailyReminders();

        System.out.println(
                "Smart reminder check completed."
        );
    }
}
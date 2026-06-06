package com.finosai.Backend.report;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WeeklyReportScheduler {

    private final WeeklyReportService weeklyReportService;

    public WeeklyReportScheduler(
            WeeklyReportService weeklyReportService) {

        this.weeklyReportService =
                weeklyReportService;
    }

    @Scheduled(cron = "0 0 9 ? * SUN")
    public void sendWeeklyReport() {

        weeklyReportService.sendWeeklyReports();

        System.out.println(
                "Weekly reports sent successfully.");
    }
}

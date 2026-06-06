package com.finosai.Backend.report;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
public class WeeklyReportController {

    private final WeeklyReportService weeklyReportService;

    public WeeklyReportController(
            WeeklyReportService weeklyReportService) {

        this.weeklyReportService =
                weeklyReportService;
    }

    @GetMapping("/test")
    public String sendTestReport() {

        weeklyReportService.sendWeeklyReports();

        return "Weekly report sent.";
    }
}
package com.finosai.Backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    public void sendPasswordResetEmail(
            String toEmail,
            String content) {

        try {

            Resend resend = new Resend(resendApiKey);

            CreateEmailOptions params =
                    CreateEmailOptions.builder()
                            .from("FinOS AI <onboarding@resend.dev>")
                            .to("raghavbhalla0604@gmail.com")
                            .subject("FinOS AI Notification")
                            .html("<p>" + content + "</p>")
                            .build();

            resend.emails().send(params);

            System.out.println("EMAIL SENT for: " + toEmail);

        } catch (Exception e) {

            e.printStackTrace();
            System.out.println("EMAIL FAILED: " + e.getMessage());
        }
    }
}
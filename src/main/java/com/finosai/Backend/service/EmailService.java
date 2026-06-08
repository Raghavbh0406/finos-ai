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
            String email,
            String resetLink) {

        try {

            Resend resend =
                    new Resend(
                            resendApiKey
                    );

            CreateEmailOptions params =
                    CreateEmailOptions.builder()
                            .from("FinOS AI <onboarding@resend.dev>")
                            .to("raghavbhalla0604@gmail.com")
                            .subject("FinOS AI Password Reset")
                            .html(
                                    "<h2>FinOS AI Password Reset</h2>"
                                            + "<p>Reset link requested for: " + email + "</p>"
                                            + "<p>Click the link below to reset your password:</p>"
                                            + "<a href='"
                                            + resetLink
                                            + "'>"
                                            + resetLink
                                            + "</a>"
                            )
                            .build();

            resend.emails().send(
                    params
            );

            System.out.println(
                    "EMAIL SENT TO: " + email
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to send email: " + e.getMessage()
            );
        }
    }
}
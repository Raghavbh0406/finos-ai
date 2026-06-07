package com.finosai.Backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

private final JavaMailSender mailSender;

public EmailService(
        JavaMailSender mailSender) {

    this.mailSender =
            mailSender;
}

public void sendPasswordResetEmail(
        String email,
        String resetLink) {

    try {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "FinOS AI Password Reset"
        );

        message.setText(
                "Click the link below to reset your password:\n\n"
                        + resetLink
        );

        mailSender.send(message);

        System.out.println(
                "EMAIL SENT TO: " + email
        );

    } catch (Exception e) {

        e.printStackTrace();

        throw e;
    }
}

}

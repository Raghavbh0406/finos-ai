package com.finosai.Backend.service;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

private final UserRepository userRepository;
private final EmailService emailService;

private final PasswordEncoder passwordEncoder =
        new BCryptPasswordEncoder();

public UserService(
        UserRepository userRepository,
        EmailService emailService) {

    this.userRepository =
            userRepository;

    this.emailService =
            emailService;
}

public User registerUser(
        User user) {

    User existingUser =
            userRepository.findByEmail(
                    user.getEmail()
            );

    if (existingUser != null) {

        throw new RuntimeException(
                "Email already exists"
        );
    }

    user.setPassword(
            passwordEncoder.encode(
                    user.getPassword()
            )
    );

    return userRepository.save(
            user
    );
}

public User loginUser(
        String email,
        String password) {

    User user =
            userRepository.findByEmail(
                    email
            );

    if (user == null) {

        throw new RuntimeException(
                "User not found"
        );
    }

    if (!passwordEncoder.matches(
            password,
            user.getPassword())) {

        throw new RuntimeException(
                "Invalid password"
        );
    }

    return user;
}

public User getProfile(
        String email) {

    User user =
            userRepository.findByEmail(
                    email
            );

    if (user == null) {

        throw new RuntimeException(
                "User not found"
        );
    }

    return user;
}

public void changePassword(
        String email,
        String oldPassword,
        String newPassword) {

    User user =
            userRepository.findByEmail(
                    email
            );

    if (user == null) {

        throw new RuntimeException(
                "User not found"
        );
    }

    if (!passwordEncoder.matches(
            oldPassword,
            user.getPassword())) {

        throw new RuntimeException(
                "Current password is incorrect"
        );
    }

    user.setPassword(
            passwordEncoder.encode(
                    newPassword
            )
    );

    userRepository.save(
            user
    );
}

public void forgotPassword(
        String email) {

    User user =
            userRepository.findByEmail(
                    email
            );

    if (user == null) {

        throw new RuntimeException(
                "User not found"
        );
    }

    String token =
            UUID.randomUUID()
                    .toString();

    user.setResetToken(
            token
    );

    userRepository.save(
            user
    );

    String resetLink =
            "https://finos-ai-production.up.railway.app/reset-password-page?token="
                    + token;

    emailService.sendPasswordResetEmail(
            user.getEmail(),
            resetLink
    );
}

public void resetPassword(
        String token,
        String newPassword) {

    User user =
            userRepository.findByResetToken(
                    token
            );

    if (user == null) {

        throw new RuntimeException(
                "Invalid token"
        );
    }

    user.setPassword(
            passwordEncoder.encode(
                    newPassword
            )
    );

    user.setResetToken(
            null
    );

    userRepository.save(
            user
    );
}
public void deleteUser(
        String email) {

    User user =
            userRepository.findByEmail(
                    email
            );

    if (user == null) {

        throw new RuntimeException(
                "User not found"
        );
    }

    userRepository.delete(
            user
    );

}
}

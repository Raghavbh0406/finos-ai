package com.finosai.Backend.service;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {


private final UserRepository userRepository;

private final PasswordEncoder passwordEncoder =
        new BCryptPasswordEncoder();

public UserService(
        UserRepository userRepository) {

    this.userRepository =
            userRepository;
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


}

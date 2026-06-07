package com.finosai.Backend.controller;

import com.finosai.Backend.dto.LoginRequest;
import com.finosai.Backend.dto.LoginResponse;
import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.security.JwtService;
import com.finosai.Backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

private final UserRepository userRepository;
private final UserService userService;
private final JwtService jwtService;

public UserController(
        UserRepository userRepository,
        UserService userService,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.userService = userService;
    this.jwtService = jwtService;
}

@GetMapping
public List<User> getAllUsers() {

    return userRepository.findAll();
}

@PostMapping
public User createUser(
        @RequestBody User user) {

    return userService.registerUser(
            user
    );
}

@PostMapping("/login")
public LoginResponse login(
        @RequestBody LoginRequest request) {

    User user =
            userService.loginUser(
                    request.getEmail(),
                    request.getPassword()
            );

    String token =
            jwtService.generateToken(
                    user.getEmail()
            );

    return new LoginResponse(
            token,
            user.getEmail()
    );
}

@GetMapping("/profile")
public User getProfile(
        Authentication authentication) {

    return userService.getProfile(
            authentication.getName()
    );
}

@PostMapping("/change-password")
public String changePassword(
        Authentication authentication,
        @RequestBody Map<String, String> request) {

    userService.changePassword(
            authentication.getName(),
            request.get("oldPassword"),
            request.get("newPassword")
    );

    return "Password updated successfully";
}

@PostMapping("/forgot-password")
public String forgotPassword(
        @RequestBody Map<String, String> request) {

    userService.forgotPassword(
            request.get("email")
    );

    return "Password reset email sent";
}

@PostMapping("/reset-password")
public String resetPassword(
        @RequestBody Map<String, String> request) {

    userService.resetPassword(
            request.get("token"),
            request.get("newPassword")
    );

    return "Password reset successful";
}

@GetMapping("/extract")
public String extractEmail(
        @RequestParam String token) {

    return jwtService.extractEmail(
            token
    );
}

}

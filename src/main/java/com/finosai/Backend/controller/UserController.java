package com.finosai.Backend.controller;

import com.finosai.Backend.dto.LoginRequest;
import com.finosai.Backend.dto.LoginResponse;
import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.security.JwtService;
import com.finosai.Backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public User createUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getEmail()
        );
    }
    @GetMapping("/register-page")
public String registerPage() {
    return "register";
}

    @GetMapping("/extract")
    public String extractEmail(@RequestParam String token) {
        return jwtService.extractEmail(token);
    }
}
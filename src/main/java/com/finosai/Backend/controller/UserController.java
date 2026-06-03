package com.finosai.Backend.controller;

import com.finosai.Backend.dto.LoginRequest;
import com.finosai.Backend.dto.LoginResponse;
import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
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

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
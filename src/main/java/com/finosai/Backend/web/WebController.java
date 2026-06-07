package com.finosai.Backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

@GetMapping("/")
public String login() {
    return "login";
}

@GetMapping("/register")
public String register() {
    return "register";
}

@GetMapping("/dashboard-page")
public String dashboard() {
    return "dashboard";
}

@GetMapping("/expenses-page")
public String expenses() {
    return "expenses";
}

@GetMapping("/budgets-page")
public String budgets() {
    return "budgets";
}

@GetMapping("/investments-page")
public String investments() {
    return "investments";
}

@GetMapping("/savings-page")
public String savings() {
    return "savings";
}

@GetMapping("/income-page")
public String income() {
    return "income";
}

@GetMapping("/profile-page")
public String profile() {
    return "profile";
}

@GetMapping("/change-password-page")
public String changePassword() {
    return "change-password";
}

}

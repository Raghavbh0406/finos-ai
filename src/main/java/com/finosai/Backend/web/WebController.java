package com.finosai.Backend.web;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class WebController {
@GetMapping("/") public String login() { return "login"; }
@GetMapping("/register") public String register() { return "register"; }
@GetMapping("/dashboard-page") public String dashboard() { return "dashboard"; }
@GetMapping("/expenses-page") public String expenses() { return "expenses"; }
@GetMapping("/budgets-page") public String budgets() { return "budgets"; }
@GetMapping("/investments-page") public String investments() { return "investments"; }
@GetMapping("/savings-page") public String savings() { return "savings"; }
@GetMapping("/income-page") public String income() { return "income"; }
@GetMapping("/profile-page") public String profile() { return "profile"; }
@GetMapping("/change-password-page") public String changePassword() { return "change-password"; }
@GetMapping("/sip-calculator-page") public String sipCalculator() { return "sip-calculator"; }
@GetMapping("/loan-calculator-page") public String loanCalculator() { return "loan-calculator"; }
@GetMapping("/tax-calculator-page") public String taxCalculator() { return "tax-calculator"; }
@GetMapping("/retirement-calculator-page") public String retirementCalculator() { return "retirement-calculator"; }
@GetMapping("/subscriptions-page") public String subscriptions() { return "subscriptions"; }
@GetMapping("/reports-page") public String reports() { return "reports"; }
@GetMapping("/forecast-page") public String forecast() { return "forecast"; }
@GetMapping("/capital-gains-page") public String capitalGains() { return "capital-gains"; }
@GetMapping("/gst-calculator-page") public String gstCalculator() { return "gst-calculator"; }
@GetMapping("/insurance-page") public String insurance() { return "insurance"; }
@GetMapping("/tax-advisor-page") public String taxAdvisor() { return "tax-advisor"; }
@GetMapping("/portfolio-page") public String portfolio() { return "portfolio"; }
}
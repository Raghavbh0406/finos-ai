package com.finosai.Backend.budget;

import com.finosai.Backend.budget.dto.BudgetRequest;
import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {


private final BudgetRepository budgetRepository;
private final UserRepository userRepository;

public BudgetService(
        BudgetRepository budgetRepository,
        UserRepository userRepository) {

    this.budgetRepository = budgetRepository;
    this.userRepository = userRepository;
}

public Budget createBudget(
        BudgetRequest request,
        String email) {

    User user =
            userRepository.findByEmail(email);

    if (user == null) {
        throw new RuntimeException(
                "User not found"
        );
    }

    Budget budget = new Budget();

    budget.setCategory(
            request.getCategory());

    budget.setLimitAmount(
            request.getLimitAmount());

    budget.setUser(user);

    return budgetRepository.save(
            budget
    );
}

public List<Budget> getBudgetsByUser(
        String email) {

    User user =
            userRepository.findByEmail(email);

    if (user == null) {
        throw new RuntimeException(
                "User not found"
        );
    }

    return budgetRepository.findByUser(
            user
    );
}

public Budget getBudgetById(
        Long id) {

    return budgetRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Budget not found"
                    ));
}

public Budget updateBudget(
        Long id,
        BudgetRequest request) {

    Budget budget =
            budgetRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Budget not found"
                            ));

    budget.setCategory(
            request.getCategory());

    budget.setLimitAmount(
            request.getLimitAmount());

    return budgetRepository.save(
            budget
    );
}

public void deleteBudget(
        Long id) {

    budgetRepository.deleteById(
            id
    );
}


}

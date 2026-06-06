package com.finosai.Backend.expense;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.expense.dto.ExpenseRequest;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public Expense createExpense(
            ExpenseRequest request,
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        Expense expense = new Expense();

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUser(
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        return expenseRepository.findByUser(user);
    }

    public Double getTotalExpenses(
            String email) {

        return getExpensesByUser(email)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Expense not found"
                        ));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
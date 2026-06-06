package com.finosai.Backend.expense;

import com.finosai.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

    List<Expense> findByDate(LocalDate date);

    List<Expense> findByUserAndDate(
            User user,
            LocalDate date
    );
}
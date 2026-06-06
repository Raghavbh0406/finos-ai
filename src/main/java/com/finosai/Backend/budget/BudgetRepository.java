package com.finosai.Backend.budget;

import com.finosai.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByCategory(String category);

    List<Budget> findByUser(User user);
}
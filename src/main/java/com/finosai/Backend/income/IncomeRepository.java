package com.finosai.Backend.income;

import com.finosai.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository
        extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);
}
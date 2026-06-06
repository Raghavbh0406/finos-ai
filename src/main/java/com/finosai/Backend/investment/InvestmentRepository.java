package com.finosai.Backend.investment;

import com.finosai.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository
        extends JpaRepository<Investment, Long> {

    List<Investment> findByUser(User user);
}
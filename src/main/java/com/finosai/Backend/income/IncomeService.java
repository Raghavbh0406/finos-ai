package com.finosai.Backend.income;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.income.dto.IncomeRequest;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository repository;
    private final UserRepository userRepository;

    public IncomeService(
            IncomeRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public Income createIncome(
            IncomeRequest request,
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        Income income = new Income();

        income.setSource(
                request.getSource());

        income.setAmount(
                request.getAmount());

        income.setDate(
                request.getDate());

        income.setUser(user);

        return repository.save(income);
    }

    public List<Income> getIncomeByUser(
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        return repository.findByUser(user);
    }
}
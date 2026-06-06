package com.finosai.Backend.investment;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.investment.dto.InvestmentRequest;
import com.finosai.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestmentService {

    private final InvestmentRepository repository;
    private final UserRepository userRepository;

    public InvestmentService(
            InvestmentRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public Investment createInvestment(
            InvestmentRequest request,
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Investment investment =
                new Investment();

        investment.setInvestmentType(
                request.getInvestmentType());

        investment.setInvestmentName(
                request.getInvestmentName());

        investment.setInvestedAmount(
                request.getInvestedAmount());

        investment.setCurrentValue(
                request.getCurrentValue());

        investment.setUser(user);

        return repository.save(investment);
    }

    public List<Investment> getInvestmentsByUser(
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return repository.findByUser(user);
    }
}
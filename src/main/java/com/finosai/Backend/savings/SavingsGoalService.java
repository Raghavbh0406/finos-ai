package com.finosai.Backend.savings;

import com.finosai.Backend.entity.User;
import com.finosai.Backend.repository.UserRepository;
import com.finosai.Backend.savings.dto.SavingsGoalRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository repository;
    private final UserRepository userRepository;

    public SavingsGoalService(
            SavingsGoalRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public SavingsGoal createGoal(
            SavingsGoalRequest request,
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        SavingsGoal goal = new SavingsGoal();

        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setSavedAmount(request.getSavedAmount());
        goal.setUser(user);

        return repository.save(goal);
    }

    public List<SavingsGoal> getGoalsByUser(
            String email) {

        User user =
                userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return repository.findByUser(user);
    }
}
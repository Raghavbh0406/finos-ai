package com.finosai.Backend.subscription;

import com.finosai.Backend.subscription.dto.SubscriptionRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    public Subscription createSubscription(SubscriptionRequest request) {
        Subscription subscription = new Subscription();
        subscription.setName(request.getName());
        subscription.setAmount(request.getAmount());
        subscription.setNextBillingDate(request.getNextBillingDate());
        return repository.save(subscription);
    }

    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    public Subscription updateSubscription(Long id, SubscriptionRequest request) {
        Subscription subscription = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        subscription.setName(request.getName());
        subscription.setAmount(request.getAmount());
        subscription.setNextBillingDate(request.getNextBillingDate());
        return repository.save(subscription);
    }

    public void deleteSubscription(Long id) {
        repository.deleteById(id);
    }
}
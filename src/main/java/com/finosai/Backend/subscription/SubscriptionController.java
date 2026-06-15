package com.finosai.Backend.subscription;

import com.finosai.Backend.subscription.dto.SubscriptionRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @PostMapping
    public Subscription createSubscription(
            @RequestBody SubscriptionRequest request) {
        return service.createSubscription(request);
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return service.getAllSubscriptions();
    }

    @PutMapping("/{id}")
    public Subscription updateSubscription(
            @PathVariable Long id,
            @RequestBody SubscriptionRequest request) {
        return service.updateSubscription(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        service.deleteSubscription(id);
    }
}
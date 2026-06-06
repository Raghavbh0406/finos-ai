package com.finosai.Backend.subscription.dto;

import java.time.LocalDate;

public class SubscriptionRequest {

    private String name;
    private Double amount;
    private LocalDate nextBillingDate;

    public String getName() {
        return name;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDate getNextBillingDate() {
        return nextBillingDate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setNextBillingDate(LocalDate nextBillingDate) {
        this.nextBillingDate = nextBillingDate;
    }
}
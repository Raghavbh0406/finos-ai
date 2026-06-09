package com.finosai.Backend.subscription;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double amount;

    private LocalDate nextBillingDate;

    public Subscription() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getAmount() { return amount; }
    public LocalDate getNextBillingDate() { return nextBillingDate; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setNextBillingDate(LocalDate nextBillingDate) { this.nextBillingDate = nextBillingDate; }
}
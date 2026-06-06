package com.finosai.Backend.investment;

import com.finosai.Backend.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String investmentType;

    private String investmentName;

    private Double investedAmount;

    private Double currentValue;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Investment() {
    }

    public Long getId() {
        return id;
    }

    public String getInvestmentType() {
        return investmentType;
    }

    public String getInvestmentName() {
        return investmentName;
    }

    public Double getInvestedAmount() {
        return investedAmount;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public User getUser() {
        return user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInvestmentType(String investmentType) {
        this.investmentType = investmentType;
    }

    public void setInvestmentName(String investmentName) {
        this.investmentName = investmentName;
    }

    public void setInvestedAmount(Double investedAmount) {
        this.investedAmount = investedAmount;
    }

    public void setCurrentValue(Double currentValue) {
        this.currentValue = currentValue;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
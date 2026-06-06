package com.finosai.Backend.budget.dto;

public class BudgetRequest {

    private String category;
    private Double limitAmount;

    public String getCategory() {
        return category;
    }

    public Double getLimitAmount() {
        return limitAmount;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLimitAmount(Double limitAmount) {
        this.limitAmount = limitAmount;
    }
}
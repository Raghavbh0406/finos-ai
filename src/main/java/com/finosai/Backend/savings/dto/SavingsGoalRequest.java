package com.finosai.Backend.savings.dto;

public class SavingsGoalRequest {

    private String goalName;
    private Double targetAmount;
    private Double savedAmount;

    public String getGoalName() {
        return goalName;
    }

    public Double getTargetAmount() {
        return targetAmount;
    }

    public Double getSavedAmount() {
        return savedAmount;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public void setSavedAmount(Double savedAmount) {
        this.savedAmount = savedAmount;
    }
}
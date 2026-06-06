package com.finosai.Backend.investment.dto;

public class InvestmentRequest {

    private String investmentType;
    private String investmentName;
    private Double investedAmount;
    private Double currentValue;

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
}
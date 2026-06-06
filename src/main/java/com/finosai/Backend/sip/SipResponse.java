package com.finosai.Backend.sip;

public class SipResponse {

    private Double investedAmount;
    private Double estimatedValue;
    private Double wealthGained;

    public SipResponse(
            Double investedAmount,
            Double estimatedValue,
            Double wealthGained) {

        this.investedAmount = investedAmount;
        this.estimatedValue = estimatedValue;
        this.wealthGained = wealthGained;
    }

    public Double getInvestedAmount() {
        return investedAmount;
    }

    public Double getEstimatedValue() {
        return estimatedValue;
    }

    public Double getWealthGained() {
        return wealthGained;
    }
}
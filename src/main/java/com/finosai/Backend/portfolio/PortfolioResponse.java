package com.finosai.Backend.portfolio;

public class PortfolioResponse {

    private Double totalInvested;
    private Double currentValue;
    private Double profit;
    private Double returnPercentage;

    public PortfolioResponse(
            Double totalInvested,
            Double currentValue,
            Double profit,
            Double returnPercentage) {

        this.totalInvested = totalInvested;
        this.currentValue = currentValue;
        this.profit = profit;
        this.returnPercentage = returnPercentage;
    }

    public Double getTotalInvested() {
        return totalInvested;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public Double getProfit() {
        return profit;
    }

    public Double getReturnPercentage() {
        return returnPercentage;
    }
}

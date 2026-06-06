package com.finosai.Backend.forecast;

public class ForecastResponse {

    private Double currentMonthSpent;
    private Double forecastedMonthSpend;

    public ForecastResponse(
            Double currentMonthSpent,
            Double forecastedMonthSpend) {

        this.currentMonthSpent = currentMonthSpent;
        this.forecastedMonthSpend =
                forecastedMonthSpend;
    }

    public Double getCurrentMonthSpent() {
        return currentMonthSpent;
    }

    public Double getForecastedMonthSpend() {
        return forecastedMonthSpend;
    }
}
package com.finosai.Backend.health;

public class FinancialHealthResponse {

    private Integer score;
    private String rating;

    public FinancialHealthResponse(
            Integer score,
            String rating) {

        this.score = score;
        this.rating = rating;
    }

    public Integer getScore() {
        return score;
    }

    public String getRating() {
        return rating;
    }
}
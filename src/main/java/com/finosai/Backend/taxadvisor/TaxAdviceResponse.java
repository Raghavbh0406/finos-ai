package com.finosai.Backend.taxadvisor;

public class TaxAdviceResponse {

    private String recommendation;

    public TaxAdviceResponse(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getRecommendation() {
        return recommendation;
    }
}
package com.finosai.Backend.insurance;

public class InsuranceResponse {

    private Double recommendedLifeCover;
    private Double recommendedHealthCover;
    private Double emergencyFund;
    private String riskProfile;

    public InsuranceResponse(
            Double recommendedLifeCover,
            Double recommendedHealthCover,
            Double emergencyFund,
            String riskProfile) {

        this.recommendedLifeCover = recommendedLifeCover;
        this.recommendedHealthCover = recommendedHealthCover;
        this.emergencyFund = emergencyFund;
        this.riskProfile = riskProfile;
    }

    public Double getRecommendedLifeCover() {
        return recommendedLifeCover;
    }

    public Double getRecommendedHealthCover() {
        return recommendedHealthCover;
    }

    public Double getEmergencyFund() {
        return emergencyFund;
    }

    public String getRiskProfile() {
        return riskProfile;
    }
}
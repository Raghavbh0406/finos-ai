package com.finosai.Backend.insurance;

import com.finosai.Backend.insurance.dto.InsuranceRequest;
import org.springframework.stereotype.Service;

@Service
public class InsuranceService {

    public InsuranceResponse calculate(
            InsuranceRequest request) {

        double income =
                request.getAnnualIncome();

        double lifeCover =
                income * 10;

        double healthCover;

        if (income < 500000) {
            healthCover = 500000;
        }
        else if (income < 1500000) {
            healthCover = 1000000;
        }
        else {
            healthCover = 2000000;
        }

        double emergencyFund =
                income / 2;

        String riskProfile;

        if (request.getAge() < 30) {
            riskProfile = "Aggressive";
        }
        else if (request.getAge() < 50) {
            riskProfile = "Moderate";
        }
        else {
            riskProfile = "Conservative";
        }

        return new InsuranceResponse(
                lifeCover,
                healthCover,
                emergencyFund,
                riskProfile
        );
    }
}
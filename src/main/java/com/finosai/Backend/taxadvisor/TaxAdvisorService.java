package com.finosai.Backend.taxadvisor;

import org.springframework.stereotype.Service;

@Service
public class TaxAdvisorService {

    public TaxAdviceResponse getAdvice(
            Double annualIncome) {

        String recommendation;

        if (annualIncome < 700000) {

            recommendation =
                    "Consider investing under Section 80C for future tax savings and wealth creation.";

        } else if (annualIncome < 1500000) {

            recommendation =
                    "Invest up to ₹150000 under Section 80C and explore NPS contributions for additional deductions.";

        } else {

            recommendation =
                    "Maximize Section 80C, NPS, health insurance deductions and review tax-efficient investment options.";
        }

        return new TaxAdviceResponse(
                recommendation
        );
    }
}
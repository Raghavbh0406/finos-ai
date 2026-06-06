package com.finosai.Backend.retirement;

import com.finosai.Backend.retirement.dto.RetirementRequest;
import org.springframework.stereotype.Service;

@Service
public class RetirementService {

    public RetirementResponse calculate(
            RetirementRequest request) {

        int years =
                request.getRetirementAge()
                        - request.getCurrentAge();

        int months = years * 12;

        double monthlyRate =
                request.getExpectedReturn()
                        / 12 / 100;

        double corpus =
                request.getMonthlyInvestment()
                        * ((Math.pow(
                        1 + monthlyRate,
                        months
                ) - 1)
                        / monthlyRate)
                        * (1 + monthlyRate);

        return new RetirementResponse(
                corpus,
                years
        );
    }
}
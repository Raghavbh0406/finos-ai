package com.finosai.Backend.loan;

import com.finosai.Backend.loan.dto.LoanRequest;
import org.springframework.stereotype.Service;

@Service
public class LoanService {

    public LoanResponse calculate(
            LoanRequest request) {

        double principal =
                request.getLoanAmount();

        double monthlyRate =
                request.getInterestRate()
                        / 12 / 100;

        int months =
                request.getTenureYears() * 12;

        double emi =
                principal *
                        monthlyRate *
                        Math.pow(
                                1 + monthlyRate,
                                months
                        )
                        /
                        (
                                Math.pow(
                                        1 + monthlyRate,
                                        months
                                ) - 1
                        );

        double totalPayment =
                emi * months;

        double totalInterest =
                totalPayment - principal;

        return new LoanResponse(
                emi,
                totalPayment,
                totalInterest
        );
    }
}
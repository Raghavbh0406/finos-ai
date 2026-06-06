package com.finosai.Backend.sip;

import com.finosai.Backend.sip.dto.SipRequest;
import org.springframework.stereotype.Service;

@Service
public class SipService {

    public SipResponse calculateSip(
            SipRequest request) {

        double monthlyInvestment =
                request.getMonthlyInvestment();

        int months =
                request.getYears() * 12;

        double monthlyRate =
                request.getExpectedReturn()
                        / 12 / 100;

        double futureValue =
                monthlyInvestment *
                        ((Math.pow(
                                1 + monthlyRate,
                                months
                        ) - 1)
                                / monthlyRate)
                        * (1 + monthlyRate);

        double investedAmount =
                monthlyInvestment * months;

        double wealthGained =
                futureValue - investedAmount;

        return new SipResponse(
                investedAmount,
                futureValue,
                wealthGained
        );
    }
}
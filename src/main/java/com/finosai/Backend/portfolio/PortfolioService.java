package com.finosai.Backend.portfolio;

import com.finosai.Backend.investment.Investment;
import com.finosai.Backend.investment.InvestmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    private final InvestmentRepository investmentRepository;

    public PortfolioService(
            InvestmentRepository investmentRepository) {

        this.investmentRepository =
                investmentRepository;
    }

    public PortfolioResponse getPortfolioAnalytics() {

        List<Investment> investments =
                investmentRepository.findAll();

        double totalInvested =
                investments.stream()
                        .mapToDouble(
                                Investment::getInvestedAmount)
                        .sum();

        double currentValue =
                investments.stream()
                        .mapToDouble(
                                Investment::getCurrentValue)
                        .sum();

        double profit =
                currentValue - totalInvested;

        double returnPercentage = 0;

        if (totalInvested > 0) {

            returnPercentage =
                    (profit / totalInvested) * 100;
        }

        return new PortfolioResponse(
                totalInvested,
                currentValue,
                profit,
                returnPercentage
        );
    }
}
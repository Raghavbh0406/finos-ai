package com.finosai.Backend.tax;

import com.finosai.Backend.tax.dto.TaxRequest;
import org.springframework.stereotype.Service;

@Service
public class TaxService {

    public TaxResponse calculateTax(
            TaxRequest request) {

        double income =
                request.getAnnualIncome();

        double tax = 0;

        if (income <= 400000) {
            tax = 0;
        }

        else if (income <= 800000) {
            tax = (income - 400000) * 0.05;
        }

        else if (income <= 1200000) {
            tax = 20000 +
                    ((income - 800000) * 0.10);
        }

        else if (income <= 1600000) {
            tax = 60000 +
                    ((income - 1200000) * 0.15);
        }

        else {
            tax = 120000 +
                    ((income - 1600000) * 0.20);
        }

        return new TaxResponse(
                income,
                tax,
                request.getRegime()
        );
    }
}
package com.finosai.Backend.capitalgains;

import com.finosai.Backend.capitalgains.dto.CapitalGainsRequest;
import org.springframework.stereotype.Service;

@Service
public class CapitalGainsService {

    public CapitalGainsResponse calculate(
            CapitalGainsRequest request) {

        double gain =
                request.getSellingPrice()
                        - request.getPurchasePrice();

        double tax = 0;

        if (gain > 0) {
            tax = gain * 0.125;
        }

        return new CapitalGainsResponse(
                request.getPurchasePrice(),
                request.getSellingPrice(),
                gain,
                tax
        );
    }
}
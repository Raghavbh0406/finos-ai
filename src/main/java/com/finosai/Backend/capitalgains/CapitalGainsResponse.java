package com.finosai.Backend.capitalgains;

public class CapitalGainsResponse {

    private Double purchasePrice;
    private Double sellingPrice;
    private Double capitalGain;
    private Double estimatedTax;

    public CapitalGainsResponse(
            Double purchasePrice,
            Double sellingPrice,
            Double capitalGain,
            Double estimatedTax) {

        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.capitalGain = capitalGain;
        this.estimatedTax = estimatedTax;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public Double getCapitalGain() {
        return capitalGain;
    }

    public Double getEstimatedTax() {
        return estimatedTax;
    }
}
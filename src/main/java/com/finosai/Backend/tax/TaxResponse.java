package com.finosai.Backend.tax;

public class TaxResponse {

    private Double annualIncome;
    private Double taxPayable;
    private String regime;

    public TaxResponse(
            Double annualIncome,
            Double taxPayable,
            String regime) {

        this.annualIncome = annualIncome;
        this.taxPayable = taxPayable;
        this.regime = regime;
    }

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public Double getTaxPayable() {
        return taxPayable;
    }

    public String getRegime() {
        return regime;
    }
}
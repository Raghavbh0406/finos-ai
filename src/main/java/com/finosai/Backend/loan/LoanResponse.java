package com.finosai.Backend.loan;

public class LoanResponse {

    private Double emi;
    private Double totalPayment;
    private Double totalInterest;

    public LoanResponse(
            Double emi,
            Double totalPayment,
            Double totalInterest) {

        this.emi = emi;
        this.totalPayment = totalPayment;
        this.totalInterest = totalInterest;
    }

    public Double getEmi() {
        return emi;
    }

    public Double getTotalPayment() {
        return totalPayment;
    }

    public Double getTotalInterest() {
        return totalInterest;
    }
}
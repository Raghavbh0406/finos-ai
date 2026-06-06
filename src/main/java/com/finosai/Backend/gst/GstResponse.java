package com.finosai.Backend.gst;

public class GstResponse {

    private Double baseAmount;
    private Double gstAmount;
    private Double totalAmount;

    public GstResponse(
            Double baseAmount,
            Double gstAmount,
            Double totalAmount) {

        this.baseAmount = baseAmount;
        this.gstAmount = gstAmount;
        this.totalAmount = totalAmount;
    }

    public Double getBaseAmount() {
        return baseAmount;
    }

    public Double getGstAmount() {
        return gstAmount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }
}
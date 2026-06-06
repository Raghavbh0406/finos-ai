package com.finosai.Backend.gst.dto;

public class GstRequest {

    private Double amount;
    private Double gstRate;

    public Double getAmount() {
        return amount;
    }

    public Double getGstRate() {
        return gstRate;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setGstRate(Double gstRate) {
        this.gstRate = gstRate;
    }
}
package com.finosai.Backend.income.dto;

import java.time.LocalDate;

public class IncomeRequest {

    private String source;
    private Double amount;
    private LocalDate date;

    public String getSource() {
        return source;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
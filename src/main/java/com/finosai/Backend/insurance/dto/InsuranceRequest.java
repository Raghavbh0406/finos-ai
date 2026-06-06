package com.finosai.Backend.insurance.dto;

public class InsuranceRequest {

    private Double annualIncome;
    private Integer age;

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(Double annualIncome) {
        this.annualIncome = annualIncome;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
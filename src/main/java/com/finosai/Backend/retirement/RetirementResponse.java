package com.finosai.Backend.retirement;

public class RetirementResponse {

    private Double retirementCorpus;
    private Integer yearsRemaining;

    public RetirementResponse(
            Double retirementCorpus,
            Integer yearsRemaining) {

        this.retirementCorpus = retirementCorpus;
        this.yearsRemaining = yearsRemaining;
    }

    public Double getRetirementCorpus() {
        return retirementCorpus;
    }

    public Integer getYearsRemaining() {
        return yearsRemaining;
    }
}
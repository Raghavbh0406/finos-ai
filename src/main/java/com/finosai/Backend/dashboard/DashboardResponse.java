package com.finosai.Backend.dashboard;

public class DashboardResponse {

    private Double totalExpenses;
    private Long expenseCount;
    private Double averageExpense;
    private Double highestExpense;

    public DashboardResponse(
            Double totalExpenses,
            Long expenseCount,
            Double averageExpense,
            Double highestExpense) {

        this.totalExpenses = totalExpenses;
        this.expenseCount = expenseCount;
        this.averageExpense = averageExpense;
        this.highestExpense = highestExpense;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public Long getExpenseCount() {
        return expenseCount;
    }

    public Double getAverageExpense() {
        return averageExpense;
    }

    public Double getHighestExpense() {
        return highestExpense;
    }
}
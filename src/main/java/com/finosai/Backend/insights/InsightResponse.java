package com.finosai.Backend.insights;

public class InsightResponse {

    private String message;

    public InsightResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
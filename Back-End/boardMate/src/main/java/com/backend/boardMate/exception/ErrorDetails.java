package com.backend.boardMate.exception;

import java.util.Date;

public class ErrorDetails {
    // The date and time when the error occurred
    private Date timestamp;
    // A brief message describing the error
    private String message;
    // Detailed information about the request
    private String details;

    // Constructor to initialize the error details
    public ErrorDetails(Date timestamp, String message, String details) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }
}
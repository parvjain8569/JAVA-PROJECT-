package com.bank.exception;

/**
 * Base checked exception class for banking-related domain errors.
 * Demonstrates Java Exception hierarchy and custom exception handling.
 */
public class BankingException extends Exception {
    public BankingException(String message) {
        super(message);
    }

    public BankingException(String message, Throwable cause) {
        super(message, cause);
    }
}


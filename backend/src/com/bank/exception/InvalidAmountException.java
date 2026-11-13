package com.bank.exception;

/**
 * Thrown when an invalid transaction amount (e.g., negative or zero) is provided.
 */
public class InvalidAmountException extends BankingException {
    public InvalidAmountException(String message) {
        super(message);
    }
}


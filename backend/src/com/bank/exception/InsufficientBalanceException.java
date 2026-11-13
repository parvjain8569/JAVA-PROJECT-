package com.bank.exception;

/**
 * Thrown when a withdrawal or fund transfer exceeds the permitted balance or overdraft limit.
 */
public class InsufficientBalanceException extends BankingException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}


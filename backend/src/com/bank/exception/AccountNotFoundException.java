package com.bank.exception;

/**
 * Thrown when an account lookup by account number fails.
 */
public class AccountNotFoundException extends BankingException {
    public AccountNotFoundException(String message) {
        super(message);
    }
}


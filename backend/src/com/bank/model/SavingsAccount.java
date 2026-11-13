package com.bank.model;

import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.InvalidAmountException;

/**
 * Represents a Savings Bank Account.
 * Demonstrates:
 *   - Inheritance (extends Account)
 *   - Polymorphism (overrides withdraw() and getAccountSummary())
 *   - Specific business rules: Enforces Minimum Balance of ₹1,000 and calculates interest.
 */
public class SavingsAccount extends Account {
    public static final double MINIMUM_BALANCE = 1000.00;
    private final double interestRate; // e.g., 4.0% p.a.

    public SavingsAccount(String accountNumber, String customerName, String email, double initialBalance) 
            throws InvalidAmountException, InsufficientBalanceException {
        super(accountNumber, customerName, email, initialBalance);
        if (initialBalance < MINIMUM_BALANCE) {
            throw new InsufficientBalanceException(
                String.format("Savings account requires an opening balance of at least ₹%.2f", MINIMUM_BALANCE)
            );
        }
        this.interestRate = 4.00;
    }

    public double getInterestRate() {
        return interestRate;
    }

    @Override
    public synchronized void withdraw(double amount) throws InsufficientBalanceException, InvalidAmountException {
        if (amount <= 0) {
            throw new InvalidAmountException("Withdrawal amount must be greater than zero.");
        }
        if (this.balance - amount < MINIMUM_BALANCE) {
            throw new InsufficientBalanceException(
                String.format("Withdrawal denied. Minimum balance of ₹%.2f must be maintained. Current: ₹%.2f, Requested: ₹%.2f",
                        MINIMUM_BALANCE, this.balance, amount)
            );
        }
        this.balance -= amount;
    }

    @Override
    public String getAccountType() {
        return "SAVINGS";
    }

    @Override
    public String getAccountSummary() {
        return String.format("Savings Account (Interest: %.1f%%, Min Balance: ₹%.2f)", interestRate, MINIMUM_BALANCE);
    }
}


package com.bank.model;

import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.InvalidAmountException;

/**
 * Represents a Current Bank Account for commercial/business operations.
 * Demonstrates:
 *   - Inheritance and Polymorphism
 *   - Overdraft protection logic (allows balance to drop below 0 down to overdraftLimit).
 */
public class CurrentAccount extends Account {
    private final double overdraftLimit; // e.g., ₹25,000.00

    public CurrentAccount(String accountNumber, String customerName, String email, double initialBalance, double overdraftLimit) 
            throws InvalidAmountException {
        super(accountNumber, customerName, email, initialBalance);
        this.overdraftLimit = Math.max(0, overdraftLimit);
    }

    public CurrentAccount(String accountNumber, String customerName, String email, double initialBalance) 
            throws InvalidAmountException {
        this(accountNumber, customerName, email, initialBalance, 25000.00);
    }

    public double getOverdraftLimit() {
        return overdraftLimit;
    }

    @Override
    public synchronized void withdraw(double amount) throws InsufficientBalanceException, InvalidAmountException {
        if (amount <= 0) {
            throw new InvalidAmountException("Withdrawal amount must be greater than zero.");
        }
        if (this.balance - amount < -overdraftLimit) {
            double maxAllowed = this.balance + overdraftLimit;
            throw new InsufficientBalanceException(
                String.format("Overdraft limit reached. Maximum you can withdraw is ₹%.2f (Current balance: ₹%.2f, Overdraft limit: ₹%.2f)",
                        maxAllowed, this.balance, overdraftLimit)
            );
        }
        this.balance -= amount;
    }

    @Override
    public String getAccountType() {
        return "CURRENT";
    }

    @Override
    public String getAccountSummary() {
        return String.format("Current Account (Overdraft Facility: ₹%.2f)", overdraftLimit);
    }
}


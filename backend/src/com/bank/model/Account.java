package com.bank.model;

import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.InvalidAmountException;

import java.time.LocalDateTime;

/**
 * Abstract base class representing a Bank Account.
 * Demonstrates:
 *   - OOP Foundations: Abstraction and Encapsulation.
 *   - Protected/Private state control.
 *   - Polymorphic method definitions for subtypes.
 */
public abstract class Account {
    private final String accountNumber;
    private final String customerName;
    private final String email;
    protected double balance;
    private final LocalDateTime createdAt;

    public Account(String accountNumber, String customerName, String email, double initialBalance) 
            throws InvalidAmountException {
        if (initialBalance < 0) {
            throw new InvalidAmountException("Initial deposit cannot be negative.");
        }
        this.accountNumber = accountNumber;
        this.customerName = customerName;
        this.email = email;
        this.balance = initialBalance;
        this.createdAt = LocalDateTime.now();
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getEmail() {
        return email;
    }

    public synchronized double getBalance() {
        return balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Synchronized deposit method to prevent race conditions during concurrent updates.
     */
    public synchronized void deposit(double amount) throws InvalidAmountException {
        if (amount <= 0) {
            throw new InvalidAmountException("Deposit amount must be greater than zero.");
        }
        this.balance += amount;
    }

    /**
     * Abstract withdraw method to be customized by account subtypes 
     * (Savings vs Current).
     */
    public abstract void withdraw(double amount) throws InsufficientBalanceException, InvalidAmountException;

    /**
     * Returns the specific account type descriptor.
     */
    public abstract String getAccountType();

    /**
     * Returns polymorphic summary details.
     */
    public abstract String getAccountSummary();

    @Override
    public String toString() {
        return String.format("[%s] Acc No: %s | Holder: %s | Balance: ₹%.2f",
                getAccountType(), accountNumber, customerName, balance);
    }
}


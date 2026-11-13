package com.bank.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Model class representing an individual transaction record in the ledger.
 * Satisfies encapsulation and immutability principles.
 */
public class Transaction {
    private final String transactionId;
    private final String accountNumber;
    private final TransactionType type;
    private final double amount;
    private final double balanceAfter;
    private final String targetAccountNumber;
    private final String description;
    private final LocalDateTime timestamp;

    public Transaction(String transactionId, String accountNumber, TransactionType type, 
                       double amount, double balanceAfter, String targetAccountNumber, 
                       String description) {
        this.transactionId = transactionId;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.targetAccountNumber = targetAccountNumber;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public TransactionType getType() {
        return type;
    }

    public double getAmount() {
        return amount;
    }

    public double getBalanceAfter() {
        return balanceAfter;
    }

    public String getTargetAccountNumber() {
        return targetAccountNumber;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getFormattedTimestamp() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return timestamp.format(formatter);
    }

    @Override
    public String toString() {
        return String.format("[%s] ID: %s | %s | Amount: ₹%.2f | Balance: ₹%.2f | Note: %s",
                getFormattedTimestamp(), transactionId, type, amount, balanceAfter, description);
    }
}


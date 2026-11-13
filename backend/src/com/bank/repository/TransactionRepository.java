package com.bank.repository;

import com.bank.model.Transaction;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Thread-safe transaction repository holding the global transaction ledger.
 * Fulfills CLO02 and CLO03 (Thread safety with Collections).
 */
public class TransactionRepository {
    private final List<Transaction> transactions = new CopyOnWriteArrayList<>();

    public void save(Transaction transaction) {
        transactions.add(transaction);
    }

    public List<Transaction> findAll() {
        return new ArrayList<>(transactions);
    }

    public List<Transaction> findByAccountNumber(String accountNumber) {
        if (accountNumber == null) return Collections.emptyList();
        String target = accountNumber.trim().toUpperCase();
        return transactions.stream()
                .filter(t -> t.getAccountNumber().equalsIgnoreCase(target) || 
                            (t.getTargetAccountNumber() != null && t.getTargetAccountNumber().equalsIgnoreCase(target)))
                .collect(Collectors.toList());
    }

    public int count() {
        return transactions.size();
    }
}


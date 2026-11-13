package com.bank.repository;

import com.bank.model.Account;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory repository implementing Java Collections Framework.
 * Fulfills CLO02:
 *   - ConcurrentHashMap for O(1) account lookup by account number.
 *   - ArrayList for collection views and traversals.
 */
public class AccountRepository {
    private final Map<String, Account> accountMap = new ConcurrentHashMap<>();

    public void save(Account account) {
        accountMap.put(account.getAccountNumber(), account);
    }

    public Optional<Account> findByAccountNumber(String accountNumber) {
        if (accountNumber == null) return Optional.empty();
        return Optional.ofNullable(accountMap.get(accountNumber.trim().toUpperCase()));
    }

    public List<Account> findAll() {
        return new ArrayList<>(accountMap.values());
    }

    public boolean exists(String accountNumber) {
        if (accountNumber == null) return false;
        return accountMap.containsKey(accountNumber.trim().toUpperCase());
    }

    public boolean delete(String accountNumber) {
        if (accountNumber == null) return false;
        return accountMap.remove(accountNumber.trim().toUpperCase()) != null;
    }

    public int count() {
        return accountMap.size();
    }
}


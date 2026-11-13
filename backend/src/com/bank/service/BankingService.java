package com.bank.service;

import com.bank.exception.AccountNotFoundException;
import com.bank.exception.BankingException;
import com.bank.exception.InvalidAmountException;
import com.bank.model.*;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Core business service orchestrating all banking transactions.
 * Fulfills:
 *   - CLO01: Custom exceptions & validation.
 *   - CLO02: Collections usage & aggregation.
 *   - CLO03: Multithreading and synchronization (deadlock-free two-account lock).
 *   - CLO04: Lambda expressions & Stream API (filtering, sorting, summarizing).
 */
public class BankingService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AtomicInteger transactionCounter = new AtomicInteger(1000);
    private final AtomicInteger accountCounter = new AtomicInteger(1000);

    public BankingService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Generates a unique account number: e.g., ACC1001
     */
    public synchronized String generateAccountNumber() {
        return "ACC" + accountCounter.incrementAndGet();
    }

    /**
     * Creates a new Savings or Current account.
     */
    public Account createAccount(String customerName, String email, String type, double initialBalance, double overdraftLimit) 
            throws BankingException {
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new BankingException("Customer name cannot be empty.");
        }
        if (email == null || !email.contains("@")) {
            throw new BankingException("Please provide a valid email address.");
        }

        String accNo = generateAccountNumber();
        Account account;

        if ("CURRENT".equalsIgnoreCase(type)) {
            account = new CurrentAccount(accNo, customerName.trim(), email.trim(), initialBalance, overdraftLimit);
        } else {
            account = new SavingsAccount(accNo, customerName.trim(), email.trim(), initialBalance);
        }

        accountRepository.save(account);

        // Record initial deposit transaction if amount > 0
        if (initialBalance > 0) {
            String txnId = "TXN-" + transactionCounter.incrementAndGet();
            Transaction initialTxn = new Transaction(
                txnId, accNo, TransactionType.DEPOSIT, initialBalance, initialBalance, null, "Account opening balance"
            );
            transactionRepository.save(initialTxn);
        }

        return account;
    }

    /**
     * Returns an account or throws AccountNotFoundException.
     */
    public Account getAccount(String accountNumber) throws AccountNotFoundException {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account '" + accountNumber + "' was not found."));
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    /**
     * Synchronized Deposit operation.
     */
    public Transaction deposit(String accountNumber, double amount, String description) 
            throws BankingException {
        Account account = getAccount(accountNumber);

        synchronized (account) {
            account.deposit(amount);
            String txnId = "TXN-" + transactionCounter.incrementAndGet();
            String note = (description != null && !description.trim().isEmpty()) ? description : "Cash deposit";
            Transaction txn = new Transaction(
                txnId, accountNumber, TransactionType.DEPOSIT, amount, account.getBalance(), null, note
            );
            transactionRepository.save(txn);
            return txn;
        }
    }

    /**
     * Synchronized Withdrawal operation.
     */
    public Transaction withdraw(String accountNumber, double amount, String description) 
            throws BankingException {
        Account account = getAccount(accountNumber);

        synchronized (account) {
            account.withdraw(amount);
            String txnId = "TXN-" + transactionCounter.incrementAndGet();
            String note = (description != null && !description.trim().isEmpty()) ? description : "Cash withdrawal";
            Transaction txn = new Transaction(
                txnId, accountNumber, TransactionType.WITHDRAWAL, amount, account.getBalance(), null, note
            );
            transactionRepository.save(txn);
            return txn;
        }
    }

    /**
     * Thread-safe Inter-Account Fund Transfer.
     * Prevents deadlocks by enforcing deterministic lock acquisition based on account numbers.
     * Guarantees all-or-nothing atomicity (simulating database transactions).
     */
    public List<Transaction> transfer(String fromAccNo, String toAccNo, double amount, String remark) 
            throws BankingException {
        if (fromAccNo == null || toAccNo == null) {
            throw new BankingException("Both source and destination account numbers are required.");
        }
        if (fromAccNo.equalsIgnoreCase(toAccNo)) {
            throw new BankingException("Source and destination accounts cannot be the same.");
        }
        if (amount <= 0) {
            throw new InvalidAmountException("Transfer amount must be greater than zero.");
        }

        Account source = getAccount(fromAccNo);
        Account target = getAccount(toAccNo);

        // Lock ordering prevents deadlock when two threads transfer in reverse directions simultaneously
        Account firstLock = source.getAccountNumber().compareTo(target.getAccountNumber()) < 0 ? source : target;
        Account secondLock = source.getAccountNumber().compareTo(target.getAccountNumber()) < 0 ? target : source;

        synchronized (firstLock) {
            synchronized (secondLock) {
                // Step 1: Withdraw from source
                source.withdraw(amount);

                // Step 2: Deposit to target
                try {
                    target.deposit(amount);
                } catch (Exception e) {
                    // Rollback source if target deposit failed
                    source.deposit(amount);
                    throw new BankingException("Transfer failed during crediting target account. Rollback executed: " + e.getMessage());
                }

                // Step 3: Record ledger entries
                String txnIdOut = "TXN-" + transactionCounter.incrementAndGet();
                String txnIdIn = "TXN-" + transactionCounter.incrementAndGet();
                String note = (remark != null && !remark.trim().isEmpty()) ? remark : "Fund transfer";

                Transaction debitTxn = new Transaction(
                    txnIdOut, fromAccNo, TransactionType.TRANSFER_OUT, amount, source.getBalance(), toAccNo, 
                    "Transfer to " + toAccNo + " (" + note + ")"
                );
                Transaction creditTxn = new Transaction(
                    txnIdIn, toAccNo, TransactionType.TRANSFER_IN, amount, target.getBalance(), fromAccNo, 
                    "Transfer from " + fromAccNo + " (" + note + ")"
                );

                transactionRepository.save(debitTxn);
                transactionRepository.save(creditTxn);

                return Arrays.asList(debitTxn, creditTxn);
            }
        }
    }

    /**
     * Query transactions using Java 8+ Stream API:
     * - Filtering by account number
     * - Filtering by transaction type
     * - Filtering by minimum amount
     * - Sorting using Comparator
     */
    public List<Transaction> getTransactions(String accountNumber, String typeFilter, Double minAmount, String sortBy) {
        List<Transaction> list = (accountNumber == null || accountNumber.trim().isEmpty() || "ALL".equalsIgnoreCase(accountNumber))
                ? transactionRepository.findAll()
                : transactionRepository.findByAccountNumber(accountNumber);

        return list.stream()
                // Filter by type if specified
                .filter(t -> (typeFilter == null || typeFilter.trim().isEmpty() || "ALL".equalsIgnoreCase(typeFilter)) 
                        || t.getType().name().equalsIgnoreCase(typeFilter))
                // Filter by minimum amount if specified
                .filter(t -> minAmount == null || t.getAmount() >= minAmount)
                // Sort dynamically
                .sorted((t1, t2) -> {
                    if ("AMOUNT_DESC".equalsIgnoreCase(sortBy)) {
                        return Double.compare(t2.getAmount(), t1.getAmount());
                    } else if ("AMOUNT_ASC".equalsIgnoreCase(sortBy)) {
                        return Double.compare(t1.getAmount(), t2.getAmount());
                    } else if ("DATE_ASC".equalsIgnoreCase(sortBy)) {
                        return t1.getTimestamp().compareTo(t2.getTimestamp());
                    } else {
                        // Default DATE_DESC (newest first)
                        return t2.getTimestamp().compareTo(t1.getTimestamp());
                    }
                })
                .collect(Collectors.toList());
    }

    /**
     * Analytical reporting utilizing Stream API reductions and statistics (CLO04 / Lab 18-19).
     */
    public Map<String, Object> getAnalytics() {
        List<Account> accounts = accountRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        double totalBankReserves = accounts.stream()
                .mapToDouble(Account::getBalance)
                .sum();

        long savingsCount = accounts.stream()
                .filter(a -> "SAVINGS".equalsIgnoreCase(a.getAccountType()))
                .count();

        long currentCount = accounts.stream()
                .filter(a -> "CURRENT".equalsIgnoreCase(a.getAccountType()))
                .count();

        DoubleSummaryStatistics amountStats = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .summaryStatistics();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAccounts", accounts.size());
        stats.put("savingsAccounts", savingsCount);
        stats.put("currentAccounts", currentCount);
        stats.put("totalBankReserves", totalBankReserves);
        stats.put("totalTransactions", transactions.size());
        stats.put("averageTransactionAmount", amountStats.getAverage());
        stats.put("maxTransactionAmount", amountStats.getMax());

        return stats;
    }
}


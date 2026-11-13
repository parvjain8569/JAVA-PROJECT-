package com.bank;

import com.bank.cli.BankingCLI;
import com.bank.model.Account;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.server.BankingHttpServer;
import com.bank.service.BankingService;

/**
 * Main application entrypoint for the Banking Transaction Simulator.
 * Initializes repositories, seeds initial demo data, launches the HTTP REST server
 * and opens the interactive CLI.
 */
public class BankingApplication {
    public static void main(String[] args) {
        System.out.println("Initializing Banking Transaction Simulator...");

        // 1. Initialize Repositories (Java Collections Framework)
        AccountRepository accountRepository = new AccountRepository();
        TransactionRepository transactionRepository = new TransactionRepository();

        // 2. Initialize Business Service (Concurrency + Stream API)
        BankingService bankingService = new BankingService(accountRepository, transactionRepository);

        // 3. Seed Initial Demo Accounts
        try {
            Account acc1 = bankingService.createAccount("Aarav Sharma", "aarav@example.com", "SAVINGS", 25000.0, 0);
            Account acc2 = bankingService.createAccount("Diya Patel", "diya@example.com", "SAVINGS", 15500.5, 0);
            Account acc3 = bankingService.createAccount("Rohan Verma", "rohan@example.com", "CURRENT", 50000.0, 25000.0);
            
            // Seed a few demo transactions
            bankingService.deposit(acc1.getAccountNumber(), 5000.0, "Salary bonus credit");
            bankingService.transfer(acc1.getAccountNumber(), acc2.getAccountNumber(), 3500.0, "Monthly rent share");
            
            System.out.println("✔ Seeded demo accounts: " + acc1.getAccountNumber() + ", " + acc2.getAccountNumber() + ", " + acc3.getAccountNumber());
        } catch (Exception e) {
            System.err.println("Warning during seeding: " + e.getMessage());
        }

        // 4. Start HTTP Server for Web Frontend on Port 8080
        int port = 8080;
        try {
            BankingHttpServer httpServer = new BankingHttpServer(bankingService, port);
            httpServer.start();
        } catch (Exception e) {
            System.err.println("Could not bind HTTP server to port " + port + ": " + e.getMessage());
        }

        // 5. Start CLI (if requested or by default for terminal interaction)
        boolean isCliMode = true;
        for (String arg : args) {
            if ("--no-cli".equalsIgnoreCase(arg)) {
                isCliMode = false;
                break;
            }
        }

        if (isCliMode) {
            BankingCLI cli = new BankingCLI(bankingService);
            cli.start();
        } else {
            System.out.println("Running in Server-only mode. Press Ctrl+C to terminate.");
        }
    }
}


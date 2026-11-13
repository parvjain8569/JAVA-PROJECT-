package com.bank.cli;

import com.bank.exception.BankingException;
import com.bank.model.Account;
import com.bank.model.Transaction;
import com.bank.service.BankingService;
import com.bank.util.FileExporter;

import java.io.File;
import java.util.List;
import java.util.Scanner;

/**
 * Interactive Console / Terminal Interface for the Banking Transaction Simulator.
 * Ideal for Java Lab Evaluator walkthroughs and viva examinations.
 */
public class BankingCLI {
    private final BankingService bankingService;
    private final Scanner scanner;

    public BankingCLI(BankingService bankingService) {
        this.bankingService = bankingService;
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        System.out.println("===============================================================");
        System.out.println("       WELCOME TO BANKING TRANSACTION SIMULATOR (CLI)          ");
        System.out.println("   (Core Java, OOP, Collections, Concurrency & Stream API)   ");
        System.out.println("===============================================================");

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Select an option (1-8): ");
            String choice = scanner.nextLine().trim();

            try {
                switch (choice) {
                    case "1":
                        handleCreateAccount();
                        break;
                    case "2":
                        handleDeposit();
                        break;
                    case "3":
                        handleWithdrawal();
                        break;
                    case "4":
                        handleTransfer();
                        break;
                    case "5":
                        handleBalanceEnquiry();
                        break;
                    case "6":
                        handleTransactionHistory();
                        break;
                    case "7":
                        handleExportStatement();
                        break;
                    case "8":
                        running = false;
                        System.out.println("\nExiting Banking CLI. Thank you!");
                        break;
                    default:
                        System.out.println("\n[!] Invalid selection. Please choose an option from 1 to 8.");
                }
            } catch (Exception e) {
                System.out.println("\n[ERROR] " + e.getMessage());
            }
        }
    }

    private void printMenu() {
        System.out.println("\n----------------- MAIN MENU -----------------");
        System.out.println(" 1. Create New Account (Savings / Current)");
        System.out.println(" 2. Deposit Money");
        System.out.println(" 3. Withdraw Money");
        System.out.println(" 4. Inter-Account Fund Transfer");
        System.out.println(" 5. Balance Enquiry & Account Details");
        System.out.println(" 6. Transaction History (Stream API Query)");
        System.out.println(" 7. Export Statement (File I/O -> CSV/TXT)");
        System.out.println(" 8. Exit CLI");
        System.out.println("---------------------------------------------");
    }

    private void handleCreateAccount() throws BankingException {
        System.out.println("\n--- Create New Account ---");
        System.out.print("Customer Full Name: ");
        String name = scanner.nextLine().trim();
        System.out.print("Email Address: ");
        String email = scanner.nextLine().trim();
        System.out.print("Account Type (1 for SAVINGS, 2 for CURRENT): ");
        String typeChoice = scanner.nextLine().trim();
        String type = "2".equals(typeChoice) ? "CURRENT" : "SAVINGS";

        System.out.print("Initial Deposit Amount (₹): ");
        double balance = Double.parseDouble(scanner.nextLine().trim());

        double overdraft = 0;
        if ("CURRENT".equals(type)) {
            System.out.print("Overdraft Limit [Default ₹25000]: ");
            String odStr = scanner.nextLine().trim();
            overdraft = odStr.isEmpty() ? 25000.0 : Double.parseDouble(odStr);
        }

        Account acc = bankingService.createAccount(name, email, type, balance, overdraft);
        System.out.println("\n[SUCCESS] Account successfully created!");
        System.out.println(" Account Number: " + acc.getAccountNumber());
        System.out.println(" Account Holder: " + acc.getCustomerName());
        System.out.println(" Account Type  : " + acc.getAccountType());
        System.out.println(" Balance       : ₹" + acc.getBalance());
        System.out.println(" Details       : " + acc.getAccountSummary());
    }

    private void handleDeposit() throws BankingException {
        System.out.println("\n--- Deposit Funds ---");
        System.out.print("Enter Account Number: ");
        String accNo = scanner.nextLine().trim();
        System.out.print("Deposit Amount (₹): ");
        double amount = Double.parseDouble(scanner.nextLine().trim());
        System.out.print("Description/Remarks (optional): ");
        String note = scanner.nextLine().trim();

        Transaction txn = bankingService.deposit(accNo, amount, note);
        System.out.println("\n[SUCCESS] Deposit processed successfully!");
        System.out.println(" Transaction ID: " + txn.getTransactionId());
        System.out.println(" New Balance   : ₹" + txn.getBalanceAfter());
    }

    private void handleWithdrawal() throws BankingException {
        System.out.println("\n--- Withdraw Funds ---");
        System.out.print("Enter Account Number: ");
        String accNo = scanner.nextLine().trim();
        System.out.print("Withdrawal Amount (₹): ");
        double amount = Double.parseDouble(scanner.nextLine().trim());
        System.out.print("Description/Remarks (optional): ");
        String note = scanner.nextLine().trim();

        Transaction txn = bankingService.withdraw(accNo, amount, note);
        System.out.println("\n[SUCCESS] Withdrawal processed successfully!");
        System.out.println(" Transaction ID: " + txn.getTransactionId());
        System.out.println(" Remaining Bal : ₹" + txn.getBalanceAfter());
    }

    private void handleTransfer() throws BankingException {
        System.out.println("\n--- Inter-Account Fund Transfer ---");
        System.out.print("Source Account Number      : ");
        String fromAcc = scanner.nextLine().trim();
        System.out.print("Destination Account Number : ");
        String toAcc = scanner.nextLine().trim();
        System.out.print("Transfer Amount (₹)        : ");
        double amount = Double.parseDouble(scanner.nextLine().trim());
        System.out.print("Transfer Remarks           : ");
        String note = scanner.nextLine().trim();

        List<Transaction> txns = bankingService.transfer(fromAcc, toAcc, amount, note);
        System.out.println("\n[SUCCESS] Inter-account transfer completed atomically!");
        System.out.println(" Debit Transaction : " + txns.get(0).getTransactionId());
        System.out.println(" Credit Transaction: " + txns.get(1).getTransactionId());
    }

    private void handleBalanceEnquiry() throws BankingException {
        System.out.println("\n--- Balance Enquiry ---");
        System.out.print("Enter Account Number: ");
        String accNo = scanner.nextLine().trim();
        Account acc = bankingService.getAccount(accNo);
        System.out.println("\nAccount Summary:");
        System.out.println(" Account Number: " + acc.getAccountNumber());
        System.out.println(" Holder Name   : " + acc.getCustomerName());
        System.out.println(" Type          : " + acc.getAccountType());
        System.out.println(" Balance       : ₹" + String.format("%.2f", acc.getBalance()));
        System.out.println(" Rules         : " + acc.getAccountSummary());
    }

    private void handleTransactionHistory() {
        System.out.println("\n--- Transaction History (Stream API) ---");
        System.out.print("Enter Account Number (or press Enter for ALL): ");
        String accNo = scanner.nextLine().trim();
        if (accNo.isEmpty()) accNo = "ALL";

        System.out.print("Filter by Type (DEPOSIT/WITHDRAWAL/TRANSFER_IN/TRANSFER_OUT or Enter for ALL): ");
        String type = scanner.nextLine().trim();
        if (type.isEmpty()) type = "ALL";

        System.out.print("Sort By (1: Newest First, 2: Oldest First, 3: Amount High-to-Low): ");
        String sortChoice = scanner.nextLine().trim();
        String sortBy = "DATE_DESC";
        if ("2".equals(sortChoice)) sortBy = "DATE_ASC";
        else if ("3".equals(sortChoice)) sortBy = "AMOUNT_DESC";

        List<Transaction> list = bankingService.getTransactions(accNo, type, null, sortBy);
        System.out.println("\nTransactions Found: " + list.size());
        System.out.println("----------------------------------------------------------------------------------------");
        for (Transaction t : list) {
            System.out.println(" " + t);
        }
        System.out.println("----------------------------------------------------------------------------------------");
    }

    private void handleExportStatement() throws Exception {
        System.out.println("\n--- Export Statement (File I/O) ---");
        System.out.print("Enter Account Number: ");
        String accNo = scanner.nextLine().trim();
        Account acc = bankingService.getAccount(accNo);
        List<Transaction> txns = bankingService.getTransactions(accNo, "ALL", null, "DATE_DESC");

        System.out.print("Export Format (1 for CSV, 2 for Text): ");
        String format = scanner.nextLine().trim();

        if ("2".equals(format)) {
            String text = FileExporter.generateTextStatement(acc, txns);
            System.out.println("\n" + text);
        } else {
            File f = FileExporter.exportToCsv(acc, txns);
            System.out.println("\n[SUCCESS] Statement exported to file: " + f.getAbsolutePath());
        }
    }
}


package com.bank.util;

import com.bank.model.Account;
import com.bank.model.Transaction;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * File I/O Integration utility for exporting Bank Statements.
 * Satisfies CLO04 (Unit 5: File Handling + Collections Integration):
 *   - Demonstrates try-with-resources for exception-safe stream handling.
 *   - Generates CSV and formatted text reports from Java Collections.
 */
public class FileExporter {

    private static final String EXPORT_DIR = "exports";

    public static File exportToCsv(Account account, List<Transaction> transactions) throws IOException {
        File dir = new File(EXPORT_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = String.format("%s/statement_%s_%d.csv", 
                EXPORT_DIR, account.getAccountNumber(), System.currentTimeMillis());
        File file = new File(fileName);

        // Demonstrates try-with-resources with BufferedWriter and FileWriter
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write("BANK TRANSACTION STATEMENT\n");
            writer.write(String.format("Account Number,%s\n", account.getAccountNumber()));
            writer.write(String.format("Account Holder,%s\n", account.getCustomerName()));
            writer.write(String.format("Account Type,%s\n", account.getAccountType()));
            writer.write(String.format("Current Balance,%.2f\n", account.getBalance()));
            writer.write(String.format("Statement Generated,%s\n", 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
            writer.write("\n");
            writer.write("Transaction ID,Timestamp,Type,Amount,Balance After,Target Account,Description\n");

            for (Transaction txn : transactions) {
                writer.write(String.format("%s,%s,%s,%.2f,%.2f,%s,\"%s\"\n",
                        txn.getTransactionId(),
                        txn.getFormattedTimestamp(),
                        txn.getType().name(),
                        txn.getAmount(),
                        txn.getBalanceAfter(),
                        txn.getTargetAccountNumber() != null ? txn.getTargetAccountNumber() : "N/A",
                        txn.getDescription() != null ? txn.getDescription().replace("\"", "\"\"") : ""
                ));
            }
        }

        return file;
    }

    public static String generateTextStatement(Account account, List<Transaction> transactions) {
        StringBuilder sb = new StringBuilder();
        sb.append("========================================================================================\n");
        sb.append("                                BANK OF EXCELLENCE                                      \n");
        sb.append("                                ACCOUNT STATEMENT                                       \n");
        sb.append("========================================================================================\n");
        sb.append(String.format(" Account Number : %-25s Account Type : %s\n", account.getAccountNumber(), account.getAccountType()));
        sb.append(String.format(" Account Holder : %-25s Generated On : %s\n", account.getCustomerName(), 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
        sb.append(String.format(" Current Balance: ₹%-24.2f Overdraft/Min: %s\n", account.getBalance(), account.getAccountSummary()));
        sb.append("----------------------------------------------------------------------------------------\n");
        sb.append(String.format(" %-14s | %-19s | %-12s | %-12s | %-12s | %-15s\n", 
                "TXN ID", "DATE & TIME", "TYPE", "AMOUNT (₹)", "BALANCE (₹)", "DETAILS"));
        sb.append("----------------------------------------------------------------------------------------\n");

        if (transactions.isEmpty()) {
            sb.append("                      No transactions recorded for this account.                       \n");
        } else {
            for (Transaction t : transactions) {
                sb.append(String.format(" %-14s | %-19s | %-12s | %10.2f | %11.2f | %-15s\n",
                        t.getTransactionId(),
                        t.getFormattedTimestamp(),
                        t.getType().name(),
                        t.getAmount(),
                        t.getBalanceAfter(),
                        t.getDescription() != null && t.getDescription().length() > 15 
                                ? t.getDescription().substring(0, 12) + "..." 
                                : (t.getDescription() != null ? t.getDescription() : "-")
                ));
            }
        }
        sb.append("========================================================================================\n");
        return sb.toString();
    }
}


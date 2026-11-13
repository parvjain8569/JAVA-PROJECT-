package com.bank.server;

import com.bank.exception.BankingException;
import com.bank.model.Account;
import com.bank.model.CurrentAccount;
import com.bank.model.SavingsAccount;
import com.bank.model.Transaction;
import com.bank.service.BankingService;
import com.bank.util.FileExporter;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Built-in Core Java HTTP REST Server using com.sun.net.httpserver.HttpServer.
 * Requires ZERO external dependencies (no Spring Boot, no external JARs needed).
 * Exposes a clean RESTful API for the web frontend.
 */
public class BankingHttpServer {
    private final BankingService bankingService;
    private final int port;
    private HttpServer server;

    public BankingHttpServer(BankingService bankingService, int port) {
        this.bankingService = bankingService;
        this.port = port;
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        // Register API Handlers
        server.createContext("/api/accounts", new AccountsHandler());
        server.createContext("/api/transactions", new TransactionsHandler());
        server.createContext("/api/transactions/deposit", new DepositHandler());
        server.createContext("/api/transactions/withdraw", new WithdrawHandler());
        server.createContext("/api/transactions/transfer", new TransferHandler());
        server.createContext("/api/transactions/export", new ExportHandler());
        server.createContext("/api/analytics", new AnalyticsHandler());

        server.setExecutor(null); // default executor
        server.start();
        System.out.println("=================================================");
        System.out.println(" Banking Server is actively listening on port " + port);
        System.out.println(" API Base URL: http://localhost:" + port + "/api");
        System.out.println("=================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    // ==========================================
    // HTTP HANDLERS
    // ==========================================

    private class AccountsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                List<Account> accounts = bankingService.getAllAccounts();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < accounts.size(); i++) {
                    json.append(accountToJson(accounts.get(i)));
                    if (i < accounts.size() - 1) json.append(",");
                }
                json.append("]");
                sendResponse(exchange, 200, json.toString());
            } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readRequestBody(exchange);
                Map<String, String> params = parseJsonBody(body);
                try {
                    String name = params.get("customerName");
                    String email = params.get("email");
                    String type = params.getOrDefault("accountType", "SAVINGS");
                    double initialBalance = parseDouble(params.get("initialBalance"), 0.0);
                    double overdraft = parseDouble(params.get("overdraftLimit"), 25000.0);

                    Account account = bankingService.createAccount(name, email, type, initialBalance, overdraft);
                    sendResponse(exchange, 201, accountToJson(account));
                } catch (BankingException e) {
                    sendErrorResponse(exchange, 400, e.getMessage());
                } catch (Exception e) {
                    sendErrorResponse(exchange, 500, "Internal Server Error: " + e.getMessage());
                }
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class TransactionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> queryParams = parseQueryParams(exchange.getRequestURI().getQuery());
                String accNo = queryParams.get("accountNumber");
                String type = queryParams.get("type");
                String sortBy = queryParams.get("sortBy");
                Double minAmount = queryParams.containsKey("minAmount") ? parseDouble(queryParams.get("minAmount"), null) : null;

                List<Transaction> txns = bankingService.getTransactions(accNo, type, minAmount, sortBy);
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < txns.size(); i++) {
                    json.append(transactionToJson(txns.get(i)));
                    if (i < txns.size() - 1) json.append(",");
                }
                json.append("]");
                sendResponse(exchange, 200, json.toString());
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class DepositHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> params = parseJsonBody(readRequestBody(exchange));
                try {
                    String accNo = params.get("accountNumber");
                    double amount = parseDouble(params.get("amount"), 0.0);
                    String note = params.get("description");

                    Transaction txn = bankingService.deposit(accNo, amount, note);
                    sendResponse(exchange, 200, transactionToJson(txn));
                } catch (BankingException e) {
                    sendErrorResponse(exchange, 400, e.getMessage());
                } catch (Exception e) {
                    sendErrorResponse(exchange, 500, e.getMessage());
                }
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class WithdrawHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> params = parseJsonBody(readRequestBody(exchange));
                try {
                    String accNo = params.get("accountNumber");
                    double amount = parseDouble(params.get("amount"), 0.0);
                    String note = params.get("description");

                    Transaction txn = bankingService.withdraw(accNo, amount, note);
                    sendResponse(exchange, 200, transactionToJson(txn));
                } catch (BankingException e) {
                    sendErrorResponse(exchange, 400, e.getMessage());
                } catch (Exception e) {
                    sendErrorResponse(exchange, 500, e.getMessage());
                }
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class TransferHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> params = parseJsonBody(readRequestBody(exchange));
                try {
                    String fromAcc = params.get("fromAccount");
                    String toAcc = params.get("toAccount");
                    double amount = parseDouble(params.get("amount"), 0.0);
                    String note = params.get("remark");

                    List<Transaction> txns = bankingService.transfer(fromAcc, toAcc, amount, note);
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < txns.size(); i++) {
                        json.append(transactionToJson(txns.get(i)));
                        if (i < txns.size() - 1) json.append(",");
                    }
                    json.append("]");
                    sendResponse(exchange, 200, json.toString());
                } catch (BankingException e) {
                    sendErrorResponse(exchange, 400, e.getMessage());
                } catch (Exception e) {
                    sendErrorResponse(exchange, 500, e.getMessage());
                }
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class ExportHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> q = parseQueryParams(exchange.getRequestURI().getQuery());
                String accNo = q.get("accountNumber");
                try {
                    Account acc = bankingService.getAccount(accNo);
                    List<Transaction> txns = bankingService.getTransactions(accNo, "ALL", null, "DATE_DESC");
                    String format = q.getOrDefault("format", "csv");

                    if ("text".equalsIgnoreCase(format)) {
                        String textStatement = FileExporter.generateTextStatement(acc, txns);
                        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
                        exchange.getResponseHeaders().set("Content-Disposition", "attachment; filename=\"statement_" + accNo + ".txt\"");
                        sendRawResponse(exchange, 200, textStatement.getBytes(StandardCharsets.UTF_8));
                    } else {
                        File csvFile = FileExporter.exportToCsv(acc, txns);
                        exchange.getResponseHeaders().set("Content-Type", "text/csv; charset=UTF-8");
                        exchange.getResponseHeaders().set("Content-Disposition", "attachment; filename=\"" + csvFile.getName() + "\"");
                        
                        byte[] fileBytes;
                        try (FileInputStream fis = new FileInputStream(csvFile)) {
                            fileBytes = fis.readAllBytes();
                        }
                        sendRawResponse(exchange, 200, fileBytes);
                    }
                } catch (BankingException e) {
                    sendErrorResponse(exchange, 404, e.getMessage());
                }
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private class AnalyticsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, Object> data = bankingService.getAnalytics();
                StringBuilder json = new StringBuilder("{");
                json.append("\"totalAccounts\":").append(data.get("totalAccounts")).append(",");
                json.append("\"savingsAccounts\":").append(data.get("savingsAccounts")).append(",");
                json.append("\"currentAccounts\":").append(data.get("currentAccounts")).append(",");
                json.append("\"totalBankReserves\":").append(data.get("totalBankReserves")).append(",");
                json.append("\"totalTransactions\":").append(data.get("totalTransactions")).append(",");
                json.append("\"averageTransactionAmount\":").append(data.get("averageTransactionAmount")).append(",");
                json.append("\"maxTransactionAmount\":").append(data.get("maxTransactionAmount"));
                json.append("}");
                sendResponse(exchange, 200, json.toString());
            } else {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    // ==========================================
    // UTILITIES & JSON SERIALIZATION HELPERS
    // ==========================================

    private void addCorsHeaders(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String responseText) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = responseText.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void sendRawResponse(HttpExchange exchange, int statusCode, byte[] bytes) throws IOException {
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void sendErrorResponse(HttpExchange exchange, int statusCode, String errorMsg) throws IOException {
        String json = String.format("{\"error\": true, \"message\": \"%s\"}", escapeJson(errorMsg));
        sendResponse(exchange, statusCode, json);
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
            return baos.toString(StandardCharsets.UTF_8);
        }
    }

    private Map<String, String> parseQueryParams(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null || query.trim().isEmpty()) return result;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2) {
                result.put(URLDecoder.decode(parts[0], StandardCharsets.UTF_8), 
                           URLDecoder.decode(parts[1], StandardCharsets.UTF_8));
            } else if (parts.length == 1) {
                result.put(URLDecoder.decode(parts[0], StandardCharsets.UTF_8), "");
            }
        }
        return result;
    }

    private Map<String, String> parseJsonBody(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null) return map;
        String trimmed = json.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1);
        }
        String[] pairs = trimmed.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replace("\"", "");
                String value = keyValue[1].trim().replace("\"", "");
                map.put(key, value);
            }
        }
        return map;
    }

    private double parseDouble(String str, Double defaultValue) {
        if (str == null || str.trim().isEmpty()) return defaultValue != null ? defaultValue : 0.0;
        try {
            return Double.parseDouble(str.trim());
        } catch (NumberFormatException e) {
            return defaultValue != null ? defaultValue : 0.0;
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String accountToJson(Account a) {
        double minOrOverdraft = 0;
        if (a instanceof SavingsAccount) {
            minOrOverdraft = SavingsAccount.MINIMUM_BALANCE;
        } else if (a instanceof CurrentAccount) {
            minOrOverdraft = ((CurrentAccount) a).getOverdraftLimit();
        }
        return String.format(Locale.US,
            "{\"accountNumber\":\"%s\",\"customerName\":\"%s\",\"email\":\"%s\",\"accountType\":\"%s\",\"balance\":%.2f,\"threshold\":%.2f,\"summary\":\"%s\"}",
            escapeJson(a.getAccountNumber()),
            escapeJson(a.getCustomerName()),
            escapeJson(a.getEmail()),
            a.getAccountType(),
            a.getBalance(),
            minOrOverdraft,
            escapeJson(a.getAccountSummary())
        );
    }

    private String transactionToJson(Transaction t) {
        return String.format(Locale.US,
            "{\"transactionId\":\"%s\",\"accountNumber\":\"%s\",\"type\":\"%s\",\"amount\":%.2f,\"balanceAfter\":%.2f,\"targetAccountNumber\":%s,\"description\":\"%s\",\"timestamp\":\"%s\"}",
            escapeJson(t.getTransactionId()),
            escapeJson(t.getAccountNumber()),
            t.getType().name(),
            t.getAmount(),
            t.getBalanceAfter(),
            t.getTargetAccountNumber() != null ? "\"" + escapeJson(t.getTargetAccountNumber()) + "\"" : "null",
            escapeJson(t.getDescription()),
            t.getFormattedTimestamp()
        );
    }
}


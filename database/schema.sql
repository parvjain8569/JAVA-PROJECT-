-- ========================================================
-- Banking Transaction Simulator Database Schema
-- Subject: Database Management System (24CSE0209)
-- Concepts Covered: 
--   - DDL (CREATE, ALTER, DROP)
--   - Constraints (PRIMARY KEY, FOREIGN KEY, NOT NULL, CHECK, UNIQUE)
--   - Normalization (1NF, 2NF, 3NF)
--   - Indexes for fast query retrieval
-- ========================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

-- 2. Drop existing tables if needed (maintaining referential integrity order)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

-- 3. Customers Table (Entity representing bank patrons)
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Accounts Table (Demonstrates 1-to-many relationship with Customers)
-- Includes CHECK constraints for balance and account types
CREATE TABLE accounts (
    account_number VARCHAR(20) PRIMARY KEY,
    customer_id INT NOT NULL,
    account_type ENUM('SAVINGS', 'CURRENT') NOT NULL DEFAULT 'SAVINGS',
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    interest_rate DECIMAL(5, 2) DEFAULT 4.00,       -- Applicable to SAVINGS
    overdraft_limit DECIMAL(15, 2) DEFAULT 0.00,     -- Applicable to CURRENT
    status ENUM('ACTIVE', 'DORMANT', 'FROZEN') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id) ON DELETE CASCADE,
    CONSTRAINT chk_positive_balance CHECK (balance >= -overdraft_limit)
);

-- 5. Transactions Table (Records full ledger history with audit trail)
CREATE TABLE transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    target_account_number VARCHAR(20) NULL,
    description VARCHAR(255),
    transaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'SUCCESS',
    CONSTRAINT fk_account FOREIGN KEY (account_number) 
        REFERENCES accounts(account_number) ON DELETE CASCADE,
    CONSTRAINT chk_positive_amount CHECK (amount > 0)
);

-- 6. Indexes for Performance Optimization (CLO05 / Query Processing)
CREATE INDEX idx_account_customer ON accounts(customer_id);
CREATE INDEX idx_transaction_account ON transactions(account_number);
CREATE INDEX idx_transaction_time ON transactions(transaction_timestamp);

-- 7. Views (CLO02 / Lab 7)
-- View for active account summary with customer details
CREATE OR REPLACE VIEW view_account_summary AS
SELECT 
    a.account_number,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.email,
    a.account_type,
    a.balance,
    a.status,
    a.created_at
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id;


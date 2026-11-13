-- ========================================================
-- Banking Transaction Simulator Sample Seed Data
-- ========================================================

USE banking_db;

-- Insert Sample Customers
INSERT INTO customers (customer_id, first_name, last_name, email, phone_number, address) VALUES
(1, 'Aarav', 'Sharma', 'aarav.sharma@example.com', '9876543210', 'Chandigarh, India'),
(2, 'Diya', 'Patel', 'diya.patel@example.com', '9876543211', 'Mohali, Punjab, India'),
(3, 'Rohan', 'Verma', 'rohan.verma@example.com', '9876543212', 'Rajpura, Punjab, India');

-- Insert Sample Accounts
INSERT INTO accounts (account_number, customer_id, account_type, balance, interest_rate, overdraft_limit, status) VALUES
('ACC1001', 1, 'SAVINGS', 25000.00, 4.00, 0.00, 'ACTIVE'),
('ACC1002', 2, 'SAVINGS', 15500.50, 4.00, 0.00, 'ACTIVE'),
('ACC1003', 3, 'CURRENT', 50000.00, 0.00, 25000.00, 'ACTIVE');

-- Insert Initial Opening Balance Transactions
INSERT INTO transactions (transaction_id, account_number, transaction_type, amount, balance_after, target_account_number, description) VALUES
('TXN-INIT-001', 'ACC1001', 'DEPOSIT', 25000.00, 25000.00, NULL, 'Initial opening deposit'),
('TXN-INIT-002', 'ACC1002', 'DEPOSIT', 15500.50, 15500.50, NULL, 'Initial opening deposit'),
('TXN-INIT-003', 'ACC1003', 'DEPOSIT', 50000.00, 50000.00, NULL, 'Initial corporate current deposit');


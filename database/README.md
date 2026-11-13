# Database Management System (24CSE0209) - Module

This directory contains the SQL scripts for the **Banking Transaction Simulator** database design.

## Features Covered
- **Normalization (1NF, 2NF, 3NF)**: Structured into `customers`, `accounts`, and `transactions` tables avoiding data redundancy.
- **Constraints**: 
  - `PRIMARY KEY`, `FOREIGN KEY` with cascading references
  - `CHECK (amount > 0)` and `CHECK (balance >= -overdraft_limit)`
  - `UNIQUE` constraint on customer email
- **Optimization**: Indexes on foreign keys and timestamps for fast queries.
- **Views**: `view_account_summary` for joined reporting.

## How to Run in MySQL Workbench (When Ready)
1. Open **MySQL Workbench**.
2. Connect to your Local MySQL instance.
3. Open `schema.sql` via **File -> Open SQL Script...** and execute it (Lightning icon ⚡).
4. Open `seed.sql` and execute it to populate sample data.


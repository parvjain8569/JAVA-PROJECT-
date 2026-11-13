# Banking Transaction Simulator

A full-stack banking simulation project engineered to align directly with the semester 3 curriculum of Chitkara University:
* **Programming in Java** (`25CSE0202`)
* **Front End Engineering-II** (`25CSE0203`) - *React Module*
* **Database Management System** (`24CSE0209`)

---

## 📁 Project Architecture

```
project/
├── database/                    # DBMS Module (24CSE0209)
│   ├── schema.sql               # Normalized DDL (1NF/2NF/3NF), constraints & indexes
│   ├── seed.sql                 # Sample test dataset
│   └── README.md                # Workbench setup instructions
│
├── backend/                     # Core Java Module (25CSE0202)
│   ├── src/com/bank/
│   │   ├── model/               # Account (abstract), SavingsAccount, CurrentAccount, Transaction
│   │   ├── exception/           # InsufficientBalanceException, AccountNotFoundException, etc.
│   │   ├── repository/          # In-memory Collections (HashMap & ArrayList)
│   │   ├── service/             # BankingService (Multithreading sync, Stream API, transfers)
│   │   ├── util/                # FileExporter (File I/O -> CSV/TXT via try-with-resources)
│   │   ├── server/              # BankingHttpServer (Pure Core Java REST API on port 8080)
│   │   ├── cli/                 # BankingCLI (Interactive console menu for Java viva)
│   │   └── BankingApplication.java  # Main entry point (Seeds data + Server + CLI)
│   ├── compile_and_run.bat      # One-click Windows build and execution script
│   └── README.md
│
└── frontend/                    # Front End Engineering-II Module (25CSE0203 - React)
    ├── package.json             # React 18 + Vite dependencies
    ├── vite.config.js           # Vite dev config
    ├── run_frontend.bat         # One-click script to run React dev server
    ├── index.html               # Vite HTML template
    └── src/
        ├── main.jsx             # React DOM root render
        ├── App.jsx              # Main parent component & state orchestrator
        ├── App.css              # Responsive fintech styling
        └── components/
            ├── Navbar.jsx            # Brand header & connection status
            ├── MetricsGrid.jsx       # 4 analytical metric cards
            ├── AccountSelector.jsx   # Dropdown & active account details card
            ├── ActionHub.jsx         # Controlled tabbed forms (Deposit, Withdraw, Transfer)
            ├── TransactionLedger.jsx # Search, filter badges, sort, and ledger table
            ├── CreateAccountModal.jsx# Dialog for opening Savings / Current accounts
            └── Toast.jsx             # Floating notification alerts
```

---

## 🚀 How to Run

### 1. Launch Backend (Core Java)
* **Double-click** `backend/compile_and_run.bat`
* Starts the pure Java REST API server at `http://localhost:8080/api` and opens the interactive terminal CLI.

### 2. Launch Frontend (React)
* **Double-click** `frontend/run_frontend.bat` (or run `npm run dev` inside `frontend/`).
* Opens the React application at `http://localhost:5173`.
* *(Note: If the backend is not running, the React app automatically operates in interactive local simulator mode so you can test all features right away!)*

### 3. Database (MySQL Workbench)
* Run `database/schema.sql` and `database/seed.sql` in MySQL Workbench whenever you want to test or inspect the relational schema.

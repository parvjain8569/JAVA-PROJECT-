# Front End Engineering-II (25CSE0203) - React Frontend Module

This frontend is built using **React** (powered by Vite) structured strictly according to the introductory React syllabus of Chitkara University.

---

## 🎯 Syllabus Alignment ("No Advanced React Methods")
As requested, this project adheres to introductory React principles:
* **Functional Component Architecture**: Clean separation into small, single-responsibility components (`Navbar`, `MetricsGrid`, `AccountSelector`, `ActionHub`, `TransactionLedger`, `CreateAccountModal`, `Toast`).
* **JSX Syntax**: Declarative UI layout matching the wireframes.
* **Props System**: Data and event callbacks (`onDeposit`, `onWithdraw`, `onTransfer`, `onCreateAccount`) passed downward from parent to children.
* **Controlled Form Inputs**: Input binding using standard `value` and `onChange` event handlers.
* **List Rendering**: Standard JavaScript `.map()` with unique `key` attributes.
* **Conditional Rendering**: Standard JavaScript ternaries (`condition ? a : b`) and short-circuit evaluation (`condition && <Component />`).
* **No Advanced Methods / Over-engineering**:
  - ❌ No complex hooks (`useCallback`, `useMemo`, `useReducer`, `useRef`, custom hooks)
  - ❌ No Context API (`createContext`, `useContext`)
  - ❌ No external state libraries (Redux, Redux Toolkit, Zustand)
  - ❌ No React Router (kept to a single page dashboard)

---

## 📁 Component Hierarchy

```
frontend/
├── index.html                    # Root HTML entrypoint
├── package.json                  # Dependencies (React 18 & Vite)
├── vite.config.js                # Vite build & dev config
├── run_frontend.bat              # One-click Windows launch script
└── src/
    ├── main.jsx                  # React DOM Root initialization
    ├── App.jsx                   # Central state orchestrator & API bridge
    ├── App.css                   # Complete responsive design & theme
    └── components/
        ├── Navbar.jsx            # Brand header, server status, modal trigger
        ├── MetricsGrid.jsx       # 4 analytical metric cards
        ├── AccountSelector.jsx   # Dropdown & active account details card
        ├── ActionHub.jsx         # Tabbed forms (Deposit, Withdraw, Transfer)
        ├── TransactionLedger.jsx # Search, filter badges, sort, and ledger table
        ├── CreateAccountModal.jsx# Dialog for opening Savings / Current accounts
        └── Toast.jsx             # Floating notification alerts
```

---

## 🚀 How to Run the React Frontend

### Option 1: One-Click Script (Recommended)
Simply double-click **`frontend/run_frontend.bat`**.
* It will automatically run `npm install` (if dependencies are not yet installed).
* It will then launch the Vite dev server at **`http://localhost:5173`**.

### Option 2: Using Terminal
```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Dual-Mode Support
1. **With Java Backend Running**:
   * If you run `backend/compile_and_run.bat`, the React app automatically connects to `http://localhost:8080/api` to perform live synchronized operations.
2. **Without Java Backend (Offline Simulator)**:
   * If the Java server is offline, the React app automatically operates in **client-side simulator mode**, allowing you to test account creation, deposits, withdrawals, transfers, and statement exports immediately!

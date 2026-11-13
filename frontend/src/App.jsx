import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardView from './components/DashboardView.jsx';
import AccountsView from './components/AccountsView.jsx';
import OperationsView from './components/OperationsView.jsx';
import TransactionsView from './components/TransactionsView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import CreateAccountModal from './components/CreateAccountModal.jsx';
import Toast from './components/Toast.jsx';

const API_BASE = 'http://localhost:8080/api';

const initialDemoAccounts = [
  {
    accountNumber: "ACC1001",
    customerName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    accountType: "SAVINGS",
    balance: 25000.00,
    threshold: 1000.00,
    summary: "Savings Account (Interest: 4.0%, Min Balance: ₹1000.00)"
  },
  {
    accountNumber: "ACC1002",
    customerName: "Diya Patel",
    email: "diya.patel@example.com",
    accountType: "SAVINGS",
    balance: 15500.50,
    threshold: 1000.00,
    summary: "Savings Account (Interest: 4.0%, Min Balance: ₹1000.00)"
  },
  {
    accountNumber: "ACC1003",
    customerName: "Rohan Verma",
    email: "rohan.verma@example.com",
    accountType: "CURRENT",
    balance: 50000.00,
    threshold: 25000.00,
    summary: "Current Account (Overdraft Facility: ₹25000.00)"
  }
];

const initialDemoTransactions = [
  {
    transactionId: "TXN-INIT-001",
    accountNumber: "ACC1001",
    type: "DEPOSIT",
    amount: 25000.00,
    balanceAfter: 25000.00,
    targetAccountNumber: null,
    description: "Initial opening deposit",
    timestamp: "2026-11-12 10:00:00"
  },
  {
    transactionId: "TXN-INIT-002",
    accountNumber: "ACC1002",
    type: "DEPOSIT",
    amount: 15500.50,
    balanceAfter: 15500.50,
    targetAccountNumber: null,
    description: "Initial opening deposit",
    timestamp: "2026-11-12 10:15:00"
  },
  {
    transactionId: "TXN-INIT-003",
    accountNumber: "ACC1003",
    type: "DEPOSIT",
    amount: 50000.00,
    balanceAfter: 50000.00,
    targetAccountNumber: null,
    description: "Initial corporate deposit",
    timestamp: "2026-11-12 10:30:00"
  }
];

export default function App() {
  // Navigation Section: 'dashboard' | 'accounts' | 'operations' | 'transactions' | 'analytics'
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [operationsDefaultTab, setOperationsDefaultTab] = useState('deposit');

  // Encryption / Eye Privacy Toggle State (encrypted by default)
  const [isMasked, setIsMasked] = useState(true);

  // Application Data States
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [accounts, setAccounts] = useState(initialDemoAccounts);
  const [selectedAccount, setSelectedAccount] = useState(initialDemoAccounts[0]);
  const [transactions, setTransactions] = useState(initialDemoTransactions);

  // Filter & Search States
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DATE_DESC');

  // Modal & Toast States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Section Navigation Handler
  const handleNavigate = (section, tab = 'deposit') => {
    setCurrentSection(section);
    if (tab) {
      setOperationsDefaultTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Global Eye Mask
  const handleToggleMask = () => {
    setIsMasked((prev) => {
      const next = !prev;
      showToast(next ? 'Sensitive financial details masked.' : 'Financial details decrypted and revealed.', 'info');
      return next;
    });
  };

  // Check Backend Connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_BASE}/accounts`, { signal: AbortSignal.timeout(1800) });
        if (res.ok) {
          const accs = await res.json();
          setIsBackendOnline(true);
          setAccounts(accs);
          if (accs.length > 0) setSelectedAccount(accs[0]);
          return;
        }
      } catch (e) {
        // Backend offline
      }
      setIsBackendOnline(false);
      showToast('Running in local simulator mode. Run backend/compile_and_run.bat to sync with Java!', 'info');
    };
    checkConnection();
  }, []);

  // Fetch transactions whenever selectedAccount changes (if backend is online)
  useEffect(() => {
    if (!isBackendOnline || !selectedAccount) return;
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE}/transactions?accountNumber=${selectedAccount.accountNumber}`);
        if (res.ok) {
          const list = await res.json();
          setTransactions(list);
        }
      } catch (e) {
        console.error('Failed to fetch transactions from server:', e);
      }
    };
    fetchTransactions();
  }, [selectedAccount, isBackendOnline]);

  // Handle Account Selection
  const handleSelectAccount = (accountNumber) => {
    const acc = accounts.find((a) => a.accountNumber === accountNumber);
    if (acc) {
      setSelectedAccount(acc);
      showToast(`Switched operating account to ${acc.customerName} (${acc.accountNumber})`, 'info');
    }
  };

  // Handle Deposit
  const handleDeposit = async (amount, note) => {
    if (!selectedAccount) return showToast('Please select an account first', 'error');

    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/transactions/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountNumber: selectedAccount.accountNumber,
            amount,
            description: note
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Deposit failed');

        showToast(`Deposit of ₹${amount.toFixed(2)} successful!`, 'success');
        refreshServerData();
        return;
      } catch (err) {
        showToast(err.message, 'error');
        return;
      }
    }

    // Local Simulator Fallback
    const updatedAcc = { ...selectedAccount, balance: selectedAccount.balance + amount };
    const newTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      accountNumber: selectedAccount.accountNumber,
      type: 'DEPOSIT',
      amount,
      balanceAfter: updatedAcc.balance,
      targetAccountNumber: null,
      description: note || 'Cash deposit',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setAccounts(accounts.map((a) => (a.accountNumber === updatedAcc.accountNumber ? updatedAcc : a)));
    setSelectedAccount(updatedAcc);
    setTransactions([newTxn, ...transactions]);
    showToast(`Deposit of ₹${amount.toFixed(2)} processed!`, 'success');
  };

  // Handle Withdrawal
  const handleWithdraw = async (amount, note) => {
    if (!selectedAccount) return showToast('Please select an account first', 'error');

    if (selectedAccount.accountType === 'SAVINGS' && selectedAccount.balance - amount < (selectedAccount.threshold || 1000)) {
      return showToast(`Insufficient balance! Savings must maintain min balance of ₹${selectedAccount.threshold || 1000}.`, 'error');
    }
    if (selectedAccount.accountType === 'CURRENT' && selectedAccount.balance - amount < -(selectedAccount.threshold || 25000)) {
      return showToast(`Overdraft limit exceeded! Maximum allowed deficit is ₹${selectedAccount.threshold || 25000}.`, 'error');
    }

    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/transactions/withdraw`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountNumber: selectedAccount.accountNumber,
            amount,
            description: note
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Withdrawal failed');

        showToast(`Withdrawal of ₹${amount.toFixed(2)} successful!`, 'success');
        refreshServerData();
        return;
      } catch (err) {
        showToast(err.message, 'error');
        return;
      }
    }

    // Local Simulator Fallback
    const updatedAcc = { ...selectedAccount, balance: selectedAccount.balance - amount };
    const newTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      accountNumber: selectedAccount.accountNumber,
      type: 'WITHDRAWAL',
      amount,
      balanceAfter: updatedAcc.balance,
      targetAccountNumber: null,
      description: note || 'Cash withdrawal',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setAccounts(accounts.map((a) => (a.accountNumber === updatedAcc.accountNumber ? updatedAcc : a)));
    setSelectedAccount(updatedAcc);
    setTransactions([newTxn, ...transactions]);
    showToast(`Withdrawal of ₹${amount.toFixed(2)} processed!`, 'success');
  };

  // Handle Transfer
  const handleTransfer = async (targetAccNo, amount, note) => {
    if (!selectedAccount) return showToast('Please select an account first', 'error');

    if (selectedAccount.accountNumber.toUpperCase() === targetAccNo.toUpperCase()) {
      return showToast('Source and destination accounts cannot be the same.', 'error');
    }

    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/transactions/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromAccount: selectedAccount.accountNumber,
            toAccount: targetAccNo,
            amount,
            remark: note
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Transfer failed');

        showToast(`Transferred ₹${amount.toFixed(2)} to ${targetAccNo}!`, 'success');
        refreshServerData();
        return;
      } catch (err) {
        showToast(err.message, 'error');
        return;
      }
    }

    // Local Simulator Fallback
    const targetAcc = accounts.find((a) => a.accountNumber.toUpperCase() === targetAccNo.toUpperCase());
    if (!targetAcc) {
      return showToast(`Destination account '${targetAccNo}' not found.`, 'error');
    }

    if (selectedAccount.accountType === 'SAVINGS' && selectedAccount.balance - amount < (selectedAccount.threshold || 1000)) {
      return showToast('Insufficient balance for transfer!', 'error');
    }

    const updatedSource = { ...selectedAccount, balance: selectedAccount.balance - amount };
    const updatedTarget = { ...targetAcc, balance: targetAcc.balance + amount };

    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const debitTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}-D`,
      accountNumber: selectedAccount.accountNumber,
      type: 'TRANSFER_OUT',
      amount,
      balanceAfter: updatedSource.balance,
      targetAccountNumber: targetAcc.accountNumber,
      description: `Transfer to ${targetAcc.accountNumber} (${note || 'funds'})`,
      timestamp: time
    };
    const creditTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}-C`,
      accountNumber: targetAcc.accountNumber,
      type: 'TRANSFER_IN',
      amount,
      balanceAfter: updatedTarget.balance,
      targetAccountNumber: selectedAccount.accountNumber,
      description: `Transfer from ${selectedAccount.accountNumber} (${note || 'funds'})`,
      timestamp: time
    };

    setAccounts(accounts.map((a) => {
      if (a.accountNumber === updatedSource.accountNumber) return updatedSource;
      if (a.accountNumber === updatedTarget.accountNumber) return updatedTarget;
      return a;
    }));
    setSelectedAccount(updatedSource);
    setTransactions([debitTxn, creditTxn, ...transactions]);
    showToast(`Transferred ₹${amount.toFixed(2)} to ${targetAccNo}!`, 'success');
  };

  // Handle Account Creation
  const handleCreateAccount = async (accountData) => {
    if (accountData.accountType === 'SAVINGS' && accountData.initialBalance < 1000) {
      showToast('Savings account opening requires at least ₹1,000.', 'error');
      return false;
    }

    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Account creation failed');

        showToast(`Account ${data.accountNumber} created successfully!`, 'success');
        refreshServerData();
        return true;
      } catch (err) {
        showToast(err.message, 'error');
        return false;
      }
    }

    // Local Simulator Fallback
    const nextAccNo = `ACC${1001 + accounts.length}`;
    const newAccount = {
      accountNumber: nextAccNo,
      customerName: accountData.customerName,
      email: accountData.email,
      accountType: accountData.accountType,
      balance: accountData.initialBalance,
      threshold: accountData.accountType === 'SAVINGS' ? 1000.00 : accountData.overdraftLimit,
      summary: accountData.accountType === 'SAVINGS'
        ? 'Savings Account (Interest: 4.0%, Min Balance: ₹1000.00)'
        : `Current Account (Overdraft Facility: ₹${accountData.overdraftLimit})`
    };

    const newTxns = [...transactions];
    if (accountData.initialBalance > 0) {
      newTxns.unshift({
        transactionId: `TXN-OPEN-${Date.now().toString().slice(-4)}`,
        accountNumber: nextAccNo,
        type: 'DEPOSIT',
        amount: accountData.initialBalance,
        balanceAfter: accountData.initialBalance,
        targetAccountNumber: null,
        description: 'Account opening deposit',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    setAccounts([...accounts, newAccount]);
    setSelectedAccount(newAccount);
    setTransactions(newTxns);
    showToast(`Account ${nextAccNo} created successfully!`, 'success');
    return true;
  };

  const refreshServerData = async () => {
    try {
      const accRes = await fetch(`${API_BASE}/accounts`);
      const accs = await accRes.json();
      setAccounts(accs);
      if (selectedAccount) {
        const current = accs.find((a) => a.accountNumber === selectedAccount.accountNumber);
        if (current) setSelectedAccount(current);
      }
      const txnRes = await fetch(`${API_BASE}/transactions?accountNumber=${selectedAccount ? selectedAccount.accountNumber : 'ALL'}`);
      const txns = await txnRes.json();
      setTransactions(txns);
    } catch (e) {
      console.error(e);
    }
  };

  // Export handlers
  const handleExport = (format) => {
    if (!selectedAccount) return showToast('Please select an account first', 'error');
    const accNo = selectedAccount.accountNumber;

    if (isBackendOnline) {
      window.open(`${API_BASE}/transactions/export?accountNumber=${accNo}&format=${format}`, '_blank');
      showToast(`Exporting ${format.toUpperCase()} statement via Java File I/O...`, 'info');
      return;
    }

    // Local download
    let content = '';
    const filename = `statement_${accNo}.${format === 'csv' ? 'csv' : 'txt'}`;
    const mimeType = format === 'csv' ? 'text/csv' : 'text/plain';

    if (format === 'csv') {
      content = 'Transaction ID,Timestamp,Type,Amount,Balance After,Description\n';
      transactions
        .filter((t) => t.accountNumber === accNo || t.targetAccountNumber === accNo)
        .forEach((t) => {
          content += `${t.transactionId},"${t.timestamp}",${t.type},${t.amount},${t.balanceAfter},"${t.description || ''}"\n`;
        });
    } else {
      content = `APEX BANK - STATEMENT FOR ${accNo}\n`;
      content += `Holder: ${selectedAccount.customerName}\n`;
      content += `Current Balance: ₹${selectedAccount.balance.toFixed(2)}\n\n`;
      content += 'TXN ID       | TIMESTAMP           | TYPE         | AMOUNT    | BALANCE\n';
      content += '-------------------------------------------------------------------------\n';
      transactions
        .filter((t) => t.accountNumber === accNo || t.targetAccountNumber === accNo)
        .forEach((t) => {
          content += `${t.transactionId.padEnd(12)} | ${t.timestamp} | ${t.type.padEnd(12)} | ₹${t.amount.toFixed(2).padEnd(8)} | ₹${t.balanceAfter.toFixed(2)}\n`;
        });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  // Calculate Metrics
  const totalReserves = accounts.reduce((sum, a) => sum + a.balance, 0);
  const savingsCount = accounts.filter((a) => a.accountType === 'SAVINGS').length;
  const currentCount = accounts.filter((a) => a.accountType === 'CURRENT').length;
  const totalTxnAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTxnAmount = transactions.length > 0 ? totalTxnAmount / transactions.length : 0;
  const maxTxnAmount = transactions.length > 0 ? Math.max(...transactions.map(t => t.amount)) : 0;

  const metrics = {
    totalBankReserves: totalReserves,
    totalAccounts: accounts.length,
    savingsAccounts: savingsCount,
    currentAccounts: currentCount,
    totalTransactions: transactions.length,
    averageTransactionAmount: avgTxnAmount,
    maxTransactionAmount: maxTxnAmount
  };

  // Filtered transactions for TransactionsView
  const displayedTransactions = transactions
    .filter((t) => {
      if (!selectedAccount) return true;
      const accNo = selectedAccount.accountNumber;
      return t.accountNumber === accNo || t.targetAccountNumber === accNo;
    })
    .filter((t) => {
      if (filterType === 'ALL') return true;
      if (filterType === 'TRANSFER') return t.type.includes('TRANSFER');
      return t.type === filterType;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.transactionId.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.type.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
      if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
      if (sortBy === 'DATE_ASC') return new Date(a.timestamp) - new Date(b.timestamp);
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div className="app-container">
      {/* Top Navbar with Multi-section Links and Privacy Eye Button */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        isMasked={isMasked}
        onToggleMask={handleToggleMask}
        isConnected={isBackendOnline}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Render Current Section */}
      <main className="main-content">
        {currentSection === 'dashboard' && (
          <DashboardView
            selectedAccount={selectedAccount}
            metrics={metrics}
            recentTransactions={transactions.filter((t) =>
              !selectedAccount || t.accountNumber === selectedAccount.accountNumber || t.targetAccountNumber === selectedAccount.accountNumber
            )}
            isMasked={isMasked}
            onToggleMask={handleToggleMask}
            onNavigate={handleNavigate}
          />
        )}

        {currentSection === 'accounts' && (
          <AccountsView
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
            onOpenModal={() => setIsModalOpen(true)}
            isGlobalMasked={isMasked}
          />
        )}

        {currentSection === 'operations' && (
          <OperationsView
            selectedAccount={selectedAccount}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onTransfer={handleTransfer}
            isMasked={isMasked}
            onToggleMask={handleToggleMask}
            defaultTab={operationsDefaultTab}
          />
        )}

        {currentSection === 'transactions' && (
          <TransactionsView
            transactions={displayedTransactions}
            selectedAccount={selectedAccount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isMasked={isMasked}
            onToggleMask={handleToggleMask}
            onExportCsv={() => handleExport('csv')}
            onExportTxt={() => handleExport('text')}
          />
        )}

        {currentSection === 'analytics' && (
          <AnalyticsView
            metrics={metrics}
            isMasked={isMasked}
            onToggleMask={handleToggleMask}
          />
        )}
      </main>

      {/* Account Creation Modal */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateAccount={handleCreateAccount}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}

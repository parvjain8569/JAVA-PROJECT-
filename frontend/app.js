/**
 * Apex Banking - Transaction Simulator Client
 * Aligned with Front End Engineering-II (25CSE0203)
 * Demonstrates:
 *   - ES6+ (let/const, arrow functions, destructuring, template literals)
 *   - Async/Await & Fetch API with error handling
 *   - DOM manipulation & dynamic event listeners
 *   - Live search, filtering, and sorting
 *   - Toast notifications & responsive UI management
 */

const API_BASE = 'http://localhost:8080/api';

// Application State
const state = {
    isBackendOnline: false,
    accounts: [],
    selectedAccount: null,
    transactions: [],
    filterType: 'ALL',
    searchQuery: '',
    sortBy: 'DATE_DESC'
};

// Fallback demo dataset for client-side evaluation if backend is not started
const fallbackAccounts = [
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

const fallbackTransactions = [
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

// ========================================================
// INITIALIZATION
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initApp();
});

async function initApp() {
    await checkBackendConnection();
    await loadAccounts();
    await loadTransactions();
    await loadAnalytics();
}

// ========================================================
// BACKEND SYNC & API CALLS
// ========================================================
async function checkBackendConnection() {
    const badge = document.getElementById('connectionStatus');
    const text = document.getElementById('connectionText');

    try {
        const res = await fetch(`${API_BASE}/accounts`, { method: 'GET', signal: AbortSignal.timeout(1800) });
        if (res.ok) {
            state.isBackendOnline = true;
            badge.className = 'status-badge connected';
            text.textContent = 'Java Backend Connected';
            return;
        }
    } catch (e) {
        // Backend offline
    }

    state.isBackendOnline = false;
    badge.className = 'status-badge simulated';
    text.textContent = 'Simulator Mode (Java Offline)';
    showToast('Java backend is offline. Running in local simulation mode. Run compile_and_run.bat to sync!', 'info');
}

async function loadAccounts() {
    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/accounts`);
            state.accounts = await res.json();
        } catch (e) {
            console.error('Error fetching accounts:', e);
            state.accounts = [...fallbackAccounts];
        }
    } else {
        if (state.accounts.length === 0) {
            state.accounts = [...fallbackAccounts];
        }
    }

    renderAccountDropdown();
    if (!state.selectedAccount && state.accounts.length > 0) {
        selectAccount(state.accounts[0].accountNumber);
    }
}

async function loadTransactions() {
    const accNo = state.selectedAccount ? state.selectedAccount.accountNumber : 'ALL';
    
    if (state.isBackendOnline) {
        try {
            const url = `${API_BASE}/transactions?accountNumber=${accNo}&type=${state.filterType}&sortBy=${state.sortBy}`;
            const res = await fetch(url);
            state.transactions = await res.json();
        } catch (e) {
            console.error('Error fetching transactions:', e);
            state.transactions = [...fallbackTransactions];
        }
    } else {
        if (state.transactions.length === 0) {
            state.transactions = [...fallbackTransactions];
        }
    }

    renderTransactions();
}

async function loadAnalytics() {
    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/analytics`);
            const data = await res.json();
            updateMetricsUI(data);
            return;
        } catch (e) {
            console.error(e);
        }
    }

    // Client-side analytics computation
    const totalReserves = state.accounts.reduce((sum, a) => sum + a.balance, 0);
    const savings = state.accounts.filter(a => a.accountType === 'SAVINGS').length;
    const current = state.accounts.filter(a => a.accountType === 'CURRENT').length;

    updateMetricsUI({
        totalBankReserves: totalReserves,
        totalAccounts: state.accounts.length,
        savingsAccounts: savings,
        currentAccounts: current,
        totalTransactions: state.transactions.length
    });
}

function updateMetricsUI(data) {
    document.getElementById('statReserves').textContent = `₹${formatCurrency(data.totalBankReserves || 0)}`;
    document.getElementById('statAccounts').textContent = data.totalAccounts || 0;
    document.getElementById('statSavings').textContent = data.savingsAccounts || 0;
    document.getElementById('statCurrent').textContent = data.currentAccounts || 0;
    document.getElementById('statTransactions').textContent = data.totalTransactions || 0;
}

// ========================================================
// RENDERING & UI UPDATES
// ========================================================
function renderAccountDropdown() {
    const select = document.getElementById('accountDropdown');
    select.innerHTML = '';

    state.accounts.forEach(acc => {
        const option = document.createElement('option');
        option.value = acc.accountNumber;
        option.textContent = `${acc.accountNumber} - ${acc.customerName} (₹${formatCurrency(acc.balance)})`;
        select.appendChild(option);
    });

    if (state.selectedAccount) {
        select.value = state.selectedAccount.accountNumber;
    }
}

function selectAccount(accountNumber) {
    const account = state.accounts.find(a => a.accountNumber === accountNumber);
    if (!account) return;

    state.selectedAccount = account;
    
    // Update active highlight card
    document.getElementById('selectedAccBalance').textContent = `₹${formatCurrency(account.balance)}`;
    document.getElementById('selectedAccHolder').textContent = `${account.customerName} (${account.accountNumber})`;
    
    // Update left panel details
    const typeBadge = document.getElementById('selectedAccType');
    typeBadge.textContent = account.accountType;
    typeBadge.className = account.accountType === 'CURRENT' ? 'badge current' : 'badge';

    document.getElementById('detailAccNo').textContent = account.accountNumber;
    document.getElementById('detailHolder').textContent = account.customerName;
    document.getElementById('detailEmail').textContent = account.email;
    document.getElementById('detailRule').textContent = account.summary || 
        (account.accountType === 'SAVINGS' 
            ? 'Savings Rule: Minimum balance of ₹1,000 required.' 
            : 'Current Rule: Overdraft protection active.');

    loadTransactions();
}

function renderTransactions() {
    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';

    // Apply client filters if simulator mode or live search
    let filtered = state.transactions;
    
    // Filter by selected account
    if (state.selectedAccount) {
        const accNo = state.selectedAccount.accountNumber;
        filtered = filtered.filter(t => t.accountNumber === accNo || t.targetAccountNumber === accNo);
    }

    // Filter by type
    if (state.filterType !== 'ALL') {
        if (state.filterType === 'TRANSFER') {
            filtered = filtered.filter(t => t.type.includes('TRANSFER'));
        } else {
            filtered = filtered.filter(t => t.type === state.filterType);
        }
    }

    // Filter by search query
    if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.transactionId.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q)) ||
            t.type.toLowerCase().includes(q)
        );
    }

    // Sort order
    filtered.sort((a, b) => {
        if (state.sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
        if (state.sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
        if (state.sortBy === 'DATE_ASC') return new Date(a.timestamp) - new Date(b.timestamp);
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4" style="color: var(--text-muted);">No transactions match the selected criteria.</td></tr>`;
        return;
    }

    filtered.forEach(txn => {
        const tr = document.createElement('tr');
        const isCredit = txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_IN';
        const sign = isCredit ? '+' : '-';
        const amountClass = isCredit ? 'amount-positive' : 'amount-negative';

        tr.innerHTML = `
            <td class="font-mono" style="font-size: 0.78rem;">${escapeHtml(txn.transactionId)}</td>
            <td style="color: var(--text-secondary);">${escapeHtml(txn.timestamp)}</td>
            <td><span class="txn-badge ${txn.type}">${txn.type}</span></td>
            <td>${escapeHtml(txn.description || 'Transaction')}</td>
            <td class="text-right ${amountClass}">${sign}₹${formatCurrency(txn.amount)}</td>
            <td class="text-right font-mono">₹${formatCurrency(txn.balanceAfter)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========================================================
// TRANSACTION ACTIONS (DEPOSIT, WITHDRAW, TRANSFER)
// ========================================================
async function handleDeposit(amount, note) {
    if (!state.selectedAccount) return showToast('Please select an account first', 'error');

    const payload = {
        accountNumber: state.selectedAccount.accountNumber,
        amount: amount,
        description: note
    };

    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/transactions/deposit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Deposit failed');

            showToast(`Deposit of ₹${formatCurrency(amount)} successful!`, 'success');
            await refreshAll();
            return;
        } catch (err) {
            showToast(err.message, 'error');
            return;
        }
    }

    // Local Simulator Fallback
    state.selectedAccount.balance += amount;
    const newTxn = {
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        accountNumber: state.selectedAccount.accountNumber,
        type: 'DEPOSIT',
        amount: amount,
        balanceAfter: state.selectedAccount.balance,
        targetAccountNumber: null,
        description: note || 'Cash deposit',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    state.transactions.unshift(newTxn);
    showToast(`Deposit of ₹${formatCurrency(amount)} processed!`, 'success');
    refreshAllLocal();
}

async function handleWithdrawal(amount, note) {
    if (!state.selectedAccount) return showToast('Please select an account first', 'error');

    const acc = state.selectedAccount;

    // Client-side rule verification
    if (acc.accountType === 'SAVINGS' && (acc.balance - amount) < (acc.threshold || 1000)) {
        return showToast(`Insufficient funds! Savings account must maintain min balance of ₹${acc.threshold || 1000}.`, 'error');
    }
    if (acc.accountType === 'CURRENT' && (acc.balance - amount) < -(acc.threshold || 25000)) {
        return showToast(`Overdraft limit exceeded! Maximum allowed deficit is ₹${acc.threshold || 25000}.`, 'error');
    }

    const payload = {
        accountNumber: acc.accountNumber,
        amount: amount,
        description: note
    };

    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/transactions/withdraw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Withdrawal failed');

            showToast(`Withdrawal of ₹${formatCurrency(amount)} successful!`, 'success');
            await refreshAll();
            return;
        } catch (err) {
            showToast(err.message, 'error');
            return;
        }
    }

    // Local Simulator Fallback
    acc.balance -= amount;
    const newTxn = {
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        accountNumber: acc.accountNumber,
        type: 'WITHDRAWAL',
        amount: amount,
        balanceAfter: acc.balance,
        targetAccountNumber: null,
        description: note || 'Cash withdrawal',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    state.transactions.unshift(newTxn);
    showToast(`Withdrawal of ₹${formatCurrency(amount)} processed!`, 'success');
    refreshAllLocal();
}

async function handleTransfer(targetAccNo, amount, note) {
    if (!state.selectedAccount) return showToast('Please select an account first', 'error');
    const sourceAcc = state.selectedAccount;

    if (sourceAcc.accountNumber.toUpperCase() === targetAccNo.toUpperCase()) {
        return showToast('Source and destination accounts cannot be identical.', 'error');
    }

    const payload = {
        fromAccount: sourceAcc.accountNumber,
        toAccount: targetAccNo,
        amount: amount,
        remark: note
    };

    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/transactions/transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Transfer failed');

            showToast(`Successfully transferred ₹${formatCurrency(amount)} to ${targetAccNo}!`, 'success');
            await refreshAll();
            return;
        } catch (err) {
            showToast(err.message, 'error');
            return;
        }
    }

    // Local Simulator Fallback
    const targetAcc = state.accounts.find(a => a.accountNumber.toUpperCase() === targetAccNo.toUpperCase());
    if (!targetAcc) {
        return showToast(`Destination account '${targetAccNo}' not found.`, 'error');
    }

    if (sourceAcc.accountType === 'SAVINGS' && (sourceAcc.balance - amount) < (sourceAcc.threshold || 1000)) {
        return showToast(`Insufficient balance for transfer!`, 'error');
    }

    sourceAcc.balance -= amount;
    targetAcc.balance += amount;

    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    state.transactions.unshift({
        transactionId: `TXN-${Date.now().toString().slice(-6)}-D`,
        accountNumber: sourceAcc.accountNumber,
        type: 'TRANSFER_OUT',
        amount: amount,
        balanceAfter: sourceAcc.balance,
        targetAccountNumber: targetAcc.accountNumber,
        description: `Transfer to ${targetAcc.accountNumber} (${note || 'funds'})`,
        timestamp: time
    });
    state.transactions.unshift({
        transactionId: `TXN-${Date.now().toString().slice(-6)}-C`,
        accountNumber: targetAcc.accountNumber,
        type: 'TRANSFER_IN',
        amount: amount,
        balanceAfter: targetAcc.balance,
        targetAccountNumber: sourceAcc.accountNumber,
        description: `Transfer from ${sourceAcc.accountNumber} (${note || 'funds'})`,
        timestamp: time
    });

    showToast(`Transferred ₹${formatCurrency(amount)} to ${targetAccNo}!`, 'success');
    refreshAllLocal();
}

async function handleCreateAccount(name, email, type, initialBalance, overdraftLimit) {
    const payload = {
        customerName: name,
        email: email,
        accountType: type,
        initialBalance: initialBalance,
        overdraftLimit: overdraftLimit
    };

    if (state.isBackendOnline) {
        try {
            const res = await fetch(`${API_BASE}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Account creation failed');

            showToast(`Account ${data.accountNumber} created successfully!`, 'success');
            await loadAccounts();
            selectAccount(data.accountNumber);
            await loadAnalytics();
            return true;
        } catch (err) {
            showToast(err.message, 'error');
            return false;
        }
    }

    // Local Simulator Fallback
    const nextAccNo = `ACC${1001 + state.accounts.length}`;
    const newAcc = {
        accountNumber: nextAccNo,
        customerName: name,
        email: email,
        accountType: type,
        balance: initialBalance,
        threshold: type === 'SAVINGS' ? 1000.00 : overdraftLimit,
        summary: type === 'SAVINGS' 
            ? `Savings Account (Interest: 4.0%, Min Balance: ₹1000.00)`
            : `Current Account (Overdraft Facility: ₹${overdraftLimit})`
    };

    state.accounts.push(newAcc);
    if (initialBalance > 0) {
        state.transactions.unshift({
            transactionId: `TXN-OPEN-${Date.now().toString().slice(-4)}`,
            accountNumber: nextAccNo,
            type: 'DEPOSIT',
            amount: initialBalance,
            balanceAfter: initialBalance,
            targetAccountNumber: null,
            description: 'Account opening deposit',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
    }

    showToast(`Account ${nextAccNo} created successfully!`, 'success');
    renderAccountDropdown();
    selectAccount(nextAccNo);
    loadAnalytics();
    return true;
}

// ========================================================
// STATEMENT EXPORT
// ========================================================
function handleExport(format) {
    if (!state.selectedAccount) return showToast('Please select an account first', 'error');
    const accNo = state.selectedAccount.accountNumber;

    if (state.isBackendOnline) {
        window.open(`${API_BASE}/transactions/export?accountNumber=${accNo}&format=${format}`, '_blank');
        showToast(`Exporting ${format.toUpperCase()} statement via Java File I/O...`, 'info');
        return;
    }

    // Client-side fallback download
    let content = "";
    let filename = `statement_${accNo}.${format === 'csv' ? 'csv' : 'txt'}`;
    let mimeType = format === 'csv' ? 'text/csv' : 'text/plain';

    if (format === 'csv') {
        content = "Transaction ID,Timestamp,Type,Amount,Balance After,Description\n";
        state.transactions
            .filter(t => t.accountNumber === accNo || t.targetAccountNumber === accNo)
            .forEach(t => {
                content += `${t.transactionId},"${t.timestamp}",${t.type},${t.amount},${t.balanceAfter},"${t.description || ''}"\n`;
            });
    } else {
        content = `APEX BANK - STATEMENT FOR ${accNo}\n`;
        content += `Holder: ${state.selectedAccount.customerName}\n`;
        content += `Current Balance: ₹${formatCurrency(state.selectedAccount.balance)}\n\n`;
        content += "TXN ID       | TIMESTAMP           | TYPE         | AMOUNT    | BALANCE\n";
        content += "-------------------------------------------------------------------------\n";
        state.transactions
            .filter(t => t.accountNumber === accNo || t.targetAccountNumber === accNo)
            .forEach(t => {
                content += `${t.transactionId.padEnd(12)} | ${t.timestamp} | ${t.type.padEnd(12)} | ₹${formatCurrency(t.amount).padEnd(8)} | ₹${formatCurrency(t.balanceAfter)}\n`;
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
}

// ========================================================
// HELPERS & EVENT LISTENERS
// ========================================================
async function refreshAll() {
    await loadAccounts();
    if (state.selectedAccount) {
        selectAccount(state.selectedAccount.accountNumber);
    }
    await loadTransactions();
    await loadAnalytics();
}

function refreshAllLocal() {
    renderAccountDropdown();
    if (state.selectedAccount) {
        selectAccount(state.selectedAccount.accountNumber);
    }
    renderTransactions();
    loadAnalytics();
}

function setupEventListeners() {
    // Account Dropdown Change
    document.getElementById('accountDropdown').addEventListener('change', (e) => {
        selectAccount(e.target.value);
    });

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Form`).classList.add('active');
        });
    });

    // Action Forms
    document.getElementById('depositForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amt = parseFloat(document.getElementById('depositAmount').value);
        const note = document.getElementById('depositNote').value;
        await handleDeposit(amt, note);
        document.getElementById('depositForm').reset();
    });

    document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amt = parseFloat(document.getElementById('withdrawAmount').value);
        const note = document.getElementById('withdrawNote').value;
        await handleWithdrawal(amt, note);
        document.getElementById('withdrawForm').reset();
    });

    document.getElementById('transferForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const target = document.getElementById('transferTarget').value.trim();
        const amt = parseFloat(document.getElementById('transferAmount').value);
        const note = document.getElementById('transferNote').value;
        await handleTransfer(target, amt, note);
        document.getElementById('transferForm').reset();
    });

    // Search and Filters
    document.getElementById('txnSearchInput').addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderTransactions();
    });

    document.querySelectorAll('#typeFilters .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('#typeFilters .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.filterType = pill.dataset.type;
            if (state.isBackendOnline) loadTransactions();
            else renderTransactions();
        });
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        if (state.isBackendOnline) loadTransactions();
        else renderTransactions();
    });

    // Exports
    document.getElementById('exportCsvBtn').addEventListener('click', () => handleExport('csv'));
    document.getElementById('exportTxtBtn').addEventListener('click', () => handleExport('text'));

    // Modal Events
    const modal = document.getElementById('createModal');
    document.getElementById('openCreateModalBtn').addEventListener('click', () => modal.classList.add('open'));
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.remove('open'));
    document.getElementById('cancelModalBtn').addEventListener('click', () => modal.classList.remove('open'));

    // Modal Account Type Switcher
    const accTypeSelect = document.getElementById('accTypeSelect');
    const overdraftGroup = document.getElementById('overdraftGroup');
    const ruleAlert = document.getElementById('modalRuleAlert');
    const initDepositInput = document.getElementById('initDeposit');

    accTypeSelect.addEventListener('change', () => {
        if (accTypeSelect.value === 'CURRENT') {
            overdraftGroup.style.display = 'block';
            ruleAlert.textContent = 'Current Account Policy: Overdraft protection active. Allows balance to drop below zero up to overdraft limit.';
            initDepositInput.value = '5000';
            initDepositInput.min = '0';
        } else {
            overdraftGroup.style.display = 'none';
            ruleAlert.textContent = 'Savings Account Policy: Minimum balance of ₹1,000 must be deposited and maintained.';
            initDepositInput.value = '2000';
            initDepositInput.min = '1000';
        }
    });

    // Create Account Form
    document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('custName').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const type = accTypeSelect.value;
        const initialBalance = parseFloat(initDepositInput.value);
        const overdraft = parseFloat(document.getElementById('overdraftVal').value || 0);

        if (type === 'SAVINGS' && initialBalance < 1000) {
            return showToast('Savings account opening requires at least ₹1,000.', 'error');
        }

        const success = await handleCreateAccount(name, email, type, initialBalance, overdraft);
        if (success) {
            document.getElementById('createAccountForm').reset();
            modal.classList.remove('open');
        }
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

function formatCurrency(val) {
    return Number(val).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


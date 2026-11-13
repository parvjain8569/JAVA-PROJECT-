import React from 'react';

/**
 * MetricsGrid Component
 * Displays banking aggregate numbers and current active balance.
 */
export default function MetricsGrid({ metrics, selectedAccount }) {
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <section className="metrics-grid">
      <div className="metric-card">
        <div className="metric-header">
          <span>Total Bank Reserves</span>
          <div className="metric-icon green">₹</div>
        </div>
        <div className="metric-value">₹{formatCurrency(metrics.totalBankReserves)}</div>
        <div className="metric-sub">Across all client accounts</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>Active Accounts</span>
          <div className="metric-icon blue">#</div>
        </div>
        <div className="metric-value">{metrics.totalAccounts || 0}</div>
        <div className="metric-sub">
          {metrics.savingsAccounts || 0} Savings, {metrics.currentAccounts || 0} Current
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>Total Transactions</span>
          <div className="metric-icon purple">⇆</div>
        </div>
        <div className="metric-value">{metrics.totalTransactions || 0}</div>
        <div className="metric-sub">Logged in secure ledger</div>
      </div>

      <div className="metric-card highlight">
        <div className="metric-header">
          <span>Active Account Balance</span>
          <div className="metric-icon gold">★</div>
        </div>
        <div className="metric-value">
          ₹{selectedAccount ? formatCurrency(selectedAccount.balance) : '0.00'}
        </div>
        <div className="metric-sub">
          {selectedAccount ? `${selectedAccount.customerName} (${selectedAccount.accountNumber})` : 'No account selected'}
        </div>
      </div>
    </section>
  );
}


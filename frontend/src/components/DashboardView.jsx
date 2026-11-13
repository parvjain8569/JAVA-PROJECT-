import React from 'react';

/**
 * DashboardView (Overview Section)
 * Features an encrypted hero balance card with an Eye icon toggle,
 * aggregate metric cards, quick operation shortcuts, and recent activity.
 */
export default function DashboardView({
  selectedAccount,
  metrics,
  recentTransactions,
  isMasked,
  onToggleMask,
  onNavigate
}) {
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="section-container">
      {/* Featured Primary Account Card */}
      <div className="card hero-account-card">
        <div className="hero-card-top">
          <div className="hero-user-info">
            <span className="hero-badge">{selectedAccount ? selectedAccount.accountType : 'SAVINGS'} ACCOUNT</span>
            <h2>{selectedAccount ? selectedAccount.customerName : 'Welcome to Apex Bank'}</h2>
            <div className="account-number-tag">
              <span>Account No: </span>
              <strong className="font-mono">
                {selectedAccount
                  ? (isMasked
                      ? `${selectedAccount.accountNumber.slice(0, 3)}••••${selectedAccount.accountNumber.slice(-2)}`
                      : selectedAccount.accountNumber)
                  : '---'}
              </strong>
            </div>
          </div>

          {/* Eye Icon Button */}
          <button
            type="button"
            className="btn-eye-card"
            onClick={onToggleMask}
            title={isMasked ? "Click to decrypt & reveal balance" : "Click to encrypt & mask balance"}
          >
            {isMasked ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
            <span>{isMasked ? "Show Balance" : "Hide Balance"}</span>
          </button>
        </div>

        <div className="hero-balance-row">
          <div className="balance-label">Available Balance</div>
          <div className="hero-balance-value font-mono">
            {selectedAccount
              ? (isMasked ? '₹••••••••' : `₹${formatCurrency(selectedAccount.balance)}`)
              : '₹••••••••'}
          </div>
          <div className="hero-subtext">
            {selectedAccount ? selectedAccount.summary : 'Encrypted Ledger System'}
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="hero-actions">
          <button onClick={() => onNavigate('operations', 'deposit')} className="btn btn-primary">
            + Deposit Funds
          </button>
          <button onClick={() => onNavigate('operations', 'withdraw')} className="btn btn-warning">
            - Withdraw
          </button>
          <button onClick={() => onNavigate('operations', 'transfer')} className="btn btn-outline">
            ⇆ Transfer Money
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Bank Reserves</span>
            <div className="metric-icon">₹</div>
          </div>
          <div className="metric-value font-mono">
            {isMasked ? '₹••••••••' : `₹${formatCurrency(metrics.totalBankReserves)}`}
          </div>
          <div className="metric-sub">Across all accounts</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Active Accounts</span>
            <div className="metric-icon">#</div>
          </div>
          <div className="metric-value font-mono">{metrics.totalAccounts || 0}</div>
          <div className="metric-sub">
            {metrics.savingsAccounts || 0} Savings, {metrics.currentAccounts || 0} Current
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Transactions</span>
            <div className="metric-icon">⇆</div>
          </div>
          <div className="metric-value font-mono">{metrics.totalTransactions || 0}</div>
          <div className="metric-sub">Logged in ledger</div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card recent-activity-card">
        <div className="card-header-row">
          <div>
            <h3>Recent Ledger Activity</h3>
            <p className="subtext">Latest transactions on active account</p>
          </div>
          <button onClick={() => onNavigate('transactions')} className="btn btn-outline btn-sm">
            View All Ledger →
          </button>
        </div>

        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Note</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Balance After</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    No recent transactions recorded.
                  </td>
                </tr>
              ) : (
                recentTransactions.slice(0, 4).map((txn) => {
                  const isCredit = txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_IN';
                  return (
                    <tr key={txn.transactionId}>
                      <td className="font-mono">{txn.transactionId}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{txn.timestamp}</td>
                      <td><span className={`txn-badge ${txn.type}`}>{txn.type}</span></td>
                      <td>{txn.description || 'Transaction'}</td>
                      <td className={`text-right ${isCredit ? 'amount-positive' : 'amount-negative'}`}>
                        {isCredit ? '+' : '-'}₹{formatCurrency(txn.amount)}
                      </td>
                      <td className="text-right font-mono">
                        {isMasked ? '₹••••••' : `₹${formatCurrency(txn.balanceAfter)}`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


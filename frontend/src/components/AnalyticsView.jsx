import React from 'react';

/**
 * AnalyticsView (Analytics & Metrics Section)
 * Analytical calculations computed using Java Stream API / client-side reductions.
 */
export default function AnalyticsView({ metrics, isMasked, onToggleMask }) {
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const savingsPct = metrics.totalAccounts > 0
    ? Math.round((metrics.savingsAccounts / metrics.totalAccounts) * 100)
    : 0;
  const currentPct = metrics.totalAccounts > 0
    ? Math.round((metrics.currentAccounts / metrics.totalAccounts) * 100)
    : 0;

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2>Bank Financial Analytics</h2>
          <p className="subtext">Real-time aggregate calculations generated via Java Stream API</p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={onToggleMask}
          title={isMasked ? "Reveal Financial Figures" : "Mask Financial Figures"}
        >
          {isMasked ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Show Financials</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              <span>Hide Financials</span>
            </>
          )}
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Bank Reserves</span>
            <div className="metric-icon">₹</div>
          </div>
          <div className="metric-value font-mono">
            {isMasked ? '₹••••••••' : `₹${formatCurrency(metrics.totalBankReserves)}`}
          </div>
          <div className="metric-sub">Aggregated system funds</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Average Transaction Size</span>
            <div className="metric-icon">∑</div>
          </div>
          <div className="metric-value font-mono">
            {isMasked ? '₹••••••' : `₹${formatCurrency(metrics.averageTransactionAmount)}`}
          </div>
          <div className="metric-sub">Mean volume per transaction</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Max Recorded Transaction</span>
            <div className="metric-icon">↑</div>
          </div>
          <div className="metric-value font-mono">
            {isMasked ? '₹••••••' : `₹${formatCurrency(metrics.maxTransactionAmount)}`}
          </div>
          <div className="metric-sub">Peak single transfer/deposit</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Transactions Executed</span>
            <div className="metric-icon">#</div>
          </div>
          <div className="metric-value font-mono">{metrics.totalTransactions || 0}</div>
          <div className="metric-sub">All-time ledger entries</div>
        </div>
      </div>

      {/* Account Distribution Analytics */}
      <div className="card distribution-card">
        <h3>Account Portfolio Distribution</h3>
        <p className="subtext">Breakdown of active accounts across product categories</p>

        <div className="distribution-bars">
          <div className="dist-row">
            <div className="dist-label-row">
              <span>Savings Accounts (4.0% interest)</span>
              <strong>{metrics.savingsAccounts || 0} ({savingsPct}%)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${savingsPct}%` }}></div>
            </div>
          </div>

          <div className="dist-row">
            <div className="dist-label-row">
              <span>Current Accounts (Overdraft Protection)</span>
              <strong>{metrics.currentAccounts || 0} ({currentPct}%)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${currentPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


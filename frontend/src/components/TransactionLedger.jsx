import React from 'react';

/**
 * TransactionLedger Component
 * Renders transaction history table, search bar, filters, and export buttons.
 */
export default function TransactionLedger({
  transactions,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
  onExportCsv,
  onExportTxt
}) {
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="card ledger-card">
      <div className="ledger-header">
        <div>
          <h2>Transaction Ledger</h2>
          <p className="subtext">Processed and queried using Java Stream API & Lambdas</p>
        </div>
        <div className="export-actions">
          <button onClick={onExportCsv} className="btn btn-outline" type="button" title="Export CSV">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>
          <button onClick={onExportTxt} className="btn btn-outline" type="button" title="Export Text Statement">
            Text Statement
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ledger-toolbar">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search transactions (ID, note, type)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="pill-tabs">
            {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map((type) => (
              <button
                key={type}
                type="button"
                className={`pill ${filterType === type ? 'active' : ''}`}
                onClick={() => onFilterChange(type)}
              >
                {type === 'ALL' ? 'All' : type === 'TRANSFER' ? 'Transfers' : type === 'DEPOSIT' ? 'Deposits' : 'Withdrawals'}
              </button>
            ))}
          </div>

          <select
            className="form-control sort-dropdown"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="DATE_DESC">Newest First</option>
            <option value="DATE_ASC">Oldest First</option>
            <option value="AMOUNT_DESC">Amount High-to-Low</option>
            <option value="AMOUNT_ASC">Amount Low-to-High</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Details</th>
              <th className="text-right">Amount (₹)</th>
              <th className="text-right">Balance After (₹)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  No transactions match the selected criteria.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => {
                const isCredit = txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_IN';
                return (
                  <tr key={txn.transactionId}>
                    <td className="font-mono" style={{ fontSize: '0.78rem' }}>{txn.transactionId}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{txn.timestamp}</td>
                    <td><span className={`txn-badge ${txn.type}`}>{txn.type}</span></td>
                    <td>{txn.description || 'Transaction'}</td>
                    <td className={`text-right ${isCredit ? 'amount-positive' : 'amount-negative'}`}>
                      {isCredit ? '+' : '-'}₹{formatCurrency(txn.amount)}
                    </td>
                    <td className="text-right font-mono">₹{formatCurrency(txn.balanceAfter)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


import React from 'react';

/**
 * TransactionsView (Transaction Ledger Section)
 * Full-width transaction history with search, category filtering,
 * dynamic sorting, statement export, and Eye encryption toggling.
 */
export default function TransactionsView({
  transactions,
  selectedAccount,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
  isMasked,
  onToggleMask,
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
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2>Transaction Ledger</h2>
          <p className="subtext">
            Viewing records for{' '}
            <strong>{selectedAccount ? selectedAccount.customerName : 'All Accounts'}</strong>
            {selectedAccount && ` (${selectedAccount.accountNumber})`}
          </p>
        </div>

        <div className="export-actions">
          {/* Eye Privacy Button */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={onToggleMask}
            title={isMasked ? "Decrypt & Reveal Amounts" : "Encrypt & Mask Amounts"}
          >
            {isMasked ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span>Show Balances</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <span>Hide Balances</span>
              </>
            )}
          </button>

          <button onClick={onExportCsv} className="btn btn-outline" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>

          <button onClick={onExportTxt} className="btn btn-outline" type="button">
            Text Statement
          </button>
        </div>
      </div>

      <div className="card ledger-card">
        {/* Toolbar */}
        <div className="ledger-toolbar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by transaction ID, notes, type..."
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
                  {type === 'ALL'
                    ? 'All'
                    : type === 'TRANSFER'
                    ? 'Transfers'
                    : type === 'DEPOSIT'
                    ? 'Deposits'
                    : 'Withdrawals'}
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

        {/* Ledger Table */}
        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Account</th>
                <th>Details</th>
                <th className="text-right">Amount (₹)</th>
                <th className="text-right">Balance After (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    No transactions match your search and filter criteria.
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
                      <td className="font-mono">
                        {isMasked
                          ? `${txn.accountNumber.slice(0, 3)}••••`
                          : txn.accountNumber}
                      </td>
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


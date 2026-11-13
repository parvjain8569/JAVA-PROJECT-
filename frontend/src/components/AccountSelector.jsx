import React from 'react';

/**
 * AccountSelector Component
 * Allows user to choose which account is active and inspect account details.
 */
export default function AccountSelector({ accounts, selectedAccount, onSelectAccount }) {
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="card account-selector-card">
      <div className="card-header">
        <h2>Select Account</h2>
        <span className={selectedAccount && selectedAccount.accountType === 'CURRENT' ? 'badge current' : 'badge'}>
          {selectedAccount ? selectedAccount.accountType : 'SAVINGS'}
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="accountSelect">Active Operating Account</label>
        <select
          id="accountSelect"
          className="form-control"
          value={selectedAccount ? selectedAccount.accountNumber : ''}
          onChange={(e) => onSelectAccount(e.target.value)}
        >
          {accounts.map((acc) => (
            <option key={acc.accountNumber} value={acc.accountNumber}>
              {acc.accountNumber} - {acc.customerName} (₹{formatCurrency(acc.balance)})
            </option>
          ))}
        </select>
      </div>

      {selectedAccount && (
        <div className="account-details">
          <div className="detail-row">
            <span className="detail-label">Account No:</span>
            <span className="detail-val font-mono">{selectedAccount.accountNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Holder Name:</span>
            <span className="detail-val">{selectedAccount.customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-val">{selectedAccount.email}</span>
          </div>
          <div className="detail-alert">
            {selectedAccount.summary ||
              (selectedAccount.accountType === 'SAVINGS'
                ? 'Savings Rule: Minimum balance of ₹1,000 required.'
                : 'Current Rule: Overdraft protection active.')}
          </div>
        </div>
      )}
    </div>
  );
}


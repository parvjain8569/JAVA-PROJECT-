import React, { useState } from 'react';

/**
 * AccountsView (Accounts & Cards Section)
 * Displays all created accounts with individual Eye encryption toggles
 * for balance and account numbers.
 */
export default function AccountsView({
  accounts,
  selectedAccount,
  onSelectAccount,
  onOpenModal,
  isGlobalMasked
}) {
  // Local reveal state for individual accounts
  const [unmaskedAccs, setUnmaskedAccs] = useState({});

  const toggleAccountMask = (accNo) => {
    setUnmaskedAccs((prev) => ({
      ...prev,
      [accNo]: !prev[accNo]
    }));
  };

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
          <h2>Your Bank Accounts & Cards</h2>
          <p className="subtext">Manage accounts, view policies, and switch your operating account</p>
        </div>
        <button onClick={onOpenModal} className="btn btn-primary">
          + Open New Account
        </button>
      </div>

      <div className="accounts-cards-grid">
        {accounts.map((acc) => {
          const isSelected = selectedAccount && selectedAccount.accountNumber === acc.accountNumber;
          const isRevealed = !isGlobalMasked || unmaskedAccs[acc.accountNumber];

          return (
            <div key={acc.accountNumber} className={`card account-tile ${isSelected ? 'active-tile' : ''}`}>
              <div className="tile-top">
                <div className="tile-type-badge">
                  <span className={acc.accountType === 'CURRENT' ? 'badge current' : 'badge'}>
                    {acc.accountType}
                  </span>
                  {isSelected && <span className="active-tag">Active Account</span>}
                </div>

                {/* Individual Eye Toggle */}
                <button
                  type="button"
                  className="btn-eye-small"
                  onClick={() => toggleAccountMask(acc.accountNumber)}
                  title={isRevealed ? "Hide this account's details" : "Show this account's details"}
                >
                  {isRevealed ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>

              <div className="tile-balance-box">
                <span className="tile-label">Balance</span>
                <div className="tile-balance-val font-mono">
                  {isRevealed ? `₹${formatCurrency(acc.balance)}` : '₹••••••••'}
                </div>
              </div>

              <div className="tile-details">
                <div className="detail-row">
                  <span className="detail-label">Account No:</span>
                  <span className="detail-val font-mono">
                    {isRevealed
                      ? acc.accountNumber
                      : `${acc.accountNumber.slice(0, 3)}••••${acc.accountNumber.slice(-2)}`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Holder Name:</span>
                  <span className="detail-val">
                    {isRevealed ? acc.customerName : `${acc.customerName.slice(0, 2)}••••••`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-val font-mono">
                    {isRevealed ? acc.email : '••••••••@••••.com'}
                  </span>
                </div>
              </div>

              <div className="detail-alert">
                {acc.summary ||
                  (acc.accountType === 'SAVINGS'
                    ? 'Savings Rule: ₹1,000 minimum balance maintained.'
                    : 'Current Rule: Overdraft protection active.')}
              </div>

              <div className="tile-footer">
                {isSelected ? (
                  <button className="btn btn-outline btn-block" disabled style={{ opacity: 0.7 }}>
                    ✓ Current Operating Account
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => onSelectAccount(acc.accountNumber)}
                  >
                    Select As Operating Account
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


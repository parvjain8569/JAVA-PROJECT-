import React, { useState } from 'react';

/**
 * OperationsView (Transfers & Pay Section)
 * Dedicated section with tabbed forms for Deposit, Withdrawal, and Fund Transfer.
 */
export default function OperationsView({
  selectedAccount,
  onDeposit,
  onWithdraw,
  onTransfer,
  isMasked,
  onToggleMask,
  defaultTab = 'deposit'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  const [targetAccount, setTargetAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    onDeposit(amt, depositNote);
    setDepositAmount('');
    setDepositNote('');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    onWithdraw(amt, withdrawNote);
    setWithdrawAmount('');
    setWithdrawNote('');
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || !targetAccount.trim()) return;
    onTransfer(targetAccount.trim(), amt, transferNote);
    setTargetAccount('');
    setTransferAmount('');
    setTransferNote('');
  };

  return (
    <div className="section-container">
      {/* Current Operating Account Header Banner */}
      <div className="card operating-banner">
        <div className="banner-left">
          <span className="subtext">OPERATING ACCOUNT</span>
          <h3>{selectedAccount ? selectedAccount.customerName : 'No Account Selected'}</h3>
          <span className="font-mono text-secondary">
            {selectedAccount
              ? (isMasked
                  ? `${selectedAccount.accountNumber.slice(0, 3)}••••${selectedAccount.accountNumber.slice(-2)}`
                  : selectedAccount.accountNumber)
              : '---'}
          </span>
        </div>

        <div className="banner-right">
          <div className="balance-label">Available Balance</div>
          <div className="banner-balance font-mono">
            {selectedAccount
              ? (isMasked ? '₹••••••••' : `₹${formatCurrency(selectedAccount.balance)}`)
              : '₹••••••••'}
          </div>
          <button
            type="button"
            className="btn-eye-small inline"
            onClick={onToggleMask}
            title={isMasked ? "Reveal balance" : "Mask balance"}
          >
            {isMasked ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
            <span>{isMasked ? "Show" : "Hide"}</span>
          </button>
        </div>
      </div>

      {/* Operations Form Box */}
      <div className="operations-wrapper">
        <div className="card operations-card">
          <div className="card-tabs">
            <button
              className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
              onClick={() => setActiveTab('deposit')}
              type="button"
            >
              Deposit Funds
            </button>
            <button
              className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
              onClick={() => setActiveTab('withdraw')}
              type="button"
            >
              Withdraw Cash
            </button>
            <button
              className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
              onClick={() => setActiveTab('transfer')}
              type="button"
            >
              Inter-Account Transfer
            </button>
          </div>

          {/* Deposit Form */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDepositSubmit} className="tab-content active">
              <h3>Credit / Deposit Money</h3>
              <p className="tab-desc">Direct funds credit into operating account with synchronized thread-safety.</p>

              <div className="form-group">
                <label htmlFor="opDepAmt">Deposit Amount (₹)</label>
                <input
                  id="opDepAmt"
                  type="number"
                  className="form-control"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="opDepNote">Description / Remarks</label>
                <input
                  id="opDepNote"
                  type="text"
                  className="form-control"
                  placeholder="Salary, client payout, cash deposit..."
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Execute Deposit
              </button>
            </form>
          )}

          {/* Withdraw Form */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdrawSubmit} className="tab-content active">
              <h3>Debit / Withdraw Funds</h3>
              <p className="tab-desc">Validated against minimum balance for Savings or overdraft limit for Current accounts.</p>

              <div className="form-group">
                <label htmlFor="opWithAmt">Withdrawal Amount (₹)</label>
                <input
                  id="opWithAmt"
                  type="number"
                  className="form-control"
                  placeholder="e.g. 2500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="opWithNote">Description / Remarks</label>
                <input
                  id="opWithNote"
                  type="text"
                  className="form-control"
                  placeholder="ATM withdrawal, grocery, bills..."
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-warning btn-block">
                Confirm Withdrawal
              </button>
            </form>
          )}

          {/* Transfer Form */}
          {activeTab === 'transfer' && (
            <form onSubmit={handleTransferSubmit} className="tab-content active">
              <h3>Inter-Account Fund Transfer</h3>
              <p className="tab-desc">Atomic dual-account transfer with deadlock-free synchronization locking.</p>

              <div className="form-group">
                <label htmlFor="opTargetAcc">Destination / Beneficiary Account Number</label>
                <input
                  id="opTargetAcc"
                  type="text"
                  className="form-control font-mono"
                  placeholder="e.g. ACC1002"
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="opTransferAmt">Amount to Transfer (₹)</label>
                <input
                  id="opTransferAmt"
                  type="number"
                  className="form-control"
                  placeholder="e.g. 1500"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="opTransferNote">Transfer Purpose / Reference</label>
                <input
                  id="opTransferNote"
                  type="text"
                  className="form-control"
                  placeholder="Rent share, project fee, dining..."
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Execute Instant Transfer
              </button>
            </form>
          )}
        </div>

        {/* Guidance Card */}
        <div className="card guidance-card">
          <h4>Banking Transaction Rules</h4>
          <div className="rule-item">
            <strong>1. Savings Minimum Balance</strong>
            <p>Savings accounts require maintaining at least ₹1,000.00. Transactions breaching this limit are rejected.</p>
          </div>
          <div className="rule-item">
            <strong>2. Current Overdraft Limit</strong>
            <p>Current accounts can withdraw into negative balances up to their sanctioned overdraft limit.</p>
          </div>
          <div className="rule-item">
            <strong>3. Transaction Atomicity</strong>
            <p>Inter-account transfers execute atomically: debit and credit either succeed together or rollback completely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


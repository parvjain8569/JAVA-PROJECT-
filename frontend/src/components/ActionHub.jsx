import React, { useState } from 'react';

/**
 * ActionHub Component
 * Provides tabbed forms for Deposit, Withdrawal, and Fund Transfer.
 * Uses simple controlled inputs and props.
 */
export default function ActionHub({ onDeposit, onWithdraw, onTransfer }) {
  const [activeTab, setActiveTab] = useState('deposit');

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  // Transfer form state
  const [targetAccount, setTargetAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');

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
    <div className="card action-hub-card">
      <div className="card-tabs">
        <button
          className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
          type="button"
        >
          Deposit
        </button>
        <button
          className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
          type="button"
        >
          Withdraw
        </button>
        <button
          className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
          type="button"
        >
          Transfer
        </button>
      </div>

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <form onSubmit={handleDepositSubmit} className="tab-content active">
          <h3>Deposit Funds</h3>
          <p className="tab-desc">Credit funds into the selected account with concurrency locking.</p>

          <div className="form-group">
            <label htmlFor="depAmt">Amount (₹)</label>
            <input
              id="depAmt"
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
            <label htmlFor="depNote">Remark / Note</label>
            <input
              id="depNote"
              type="text"
              className="form-control"
              placeholder="Salary, cash deposit..."
              value={depositNote}
              onChange={(e) => setDepositNote(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">Confirm Deposit</button>
        </form>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdrawSubmit} className="tab-content active">
          <h3>Withdraw Funds</h3>
          <p className="tab-desc">Withdraw with balance & overdraft safety checks.</p>

          <div className="form-group">
            <label htmlFor="withAmt">Amount (₹)</label>
            <input
              id="withAmt"
              type="number"
              className="form-control"
              placeholder="e.g. 2000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="withNote">Remark / Note</label>
            <input
              id="withNote"
              type="text"
              className="form-control"
              placeholder="ATM withdrawal, payment..."
              value={withdrawNote}
              onChange={(e) => setWithdrawNote(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-warning btn-block">Confirm Withdrawal</button>
        </form>
      )}

      {/* Transfer Tab */}
      {activeTab === 'transfer' && (
        <form onSubmit={handleTransferSubmit} className="tab-content active">
          <h3>Inter-Account Transfer</h3>
          <p className="tab-desc">Atomic dual-account transfer with deadlock-free synchronization.</p>

          <div className="form-group">
            <label htmlFor="trgtAcc">Beneficiary Account Number</label>
            <input
              id="trgtAcc"
              type="text"
              className="form-control font-mono"
              placeholder="e.g. ACC1002"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="trAmt">Amount (₹)</label>
            <input
              id="trAmt"
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
            <label htmlFor="trNote">Transfer Purpose</label>
            <input
              id="trNote"
              type="text"
              className="form-control"
              placeholder="Rent, project fees..."
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Execute Transfer</button>
        </form>
      )}
    </div>
  );
}


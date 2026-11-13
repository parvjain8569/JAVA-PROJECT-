import React, { useState } from 'react';

/**
 * CreateAccountModal Component
 * Modal dialog for opening a new Savings or Current account.
 */
export default function CreateAccountModal({ isOpen, onClose, onCreateAccount }) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialBalance, setInitialBalance] = useState('2000');
  const [overdraftLimit, setOverdraftLimit] = useState('25000');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const balance = parseFloat(initialBalance);
    const overdraft = parseFloat(overdraftLimit || 0);

    const success = onCreateAccount({
      customerName: customerName.trim(),
      email: email.trim(),
      accountType,
      initialBalance: balance,
      overdraftLimit: overdraft
    });

    if (success) {
      setCustomerName('');
      setEmail('');
      setAccountType('SAVINGS');
      setInitialBalance('2000');
      setOverdraftLimit('25000');
      onClose();
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Open New Bank Account</h2>
          <button onClick={onClose} className="modal-close" type="button">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mName">Customer Full Name</label>
            <input
              id="mName"
              type="text"
              className="form-control"
              placeholder="e.g. Jaspreet Singh"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mEmail">Email Address</label>
            <input
              id="mEmail"
              type="email"
              className="form-control"
              placeholder="jaspreet@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mType">Account Type</label>
              <select
                id="mType"
                className="form-control"
                value={accountType}
                onChange={(e) => {
                  const type = e.target.value;
                  setAccountType(type);
                  if (type === 'SAVINGS') {
                    setInitialBalance('2000');
                  } else {
                    setInitialBalance('5000');
                  }
                }}
              >
                <option value="SAVINGS">Savings Account (4% p.a.)</option>
                <option value="CURRENT">Current Account (Business)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mDep">Initial Deposit (₹)</label>
              <input
                id="mDep"
                type="number"
                className="form-control"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                min={accountType === 'SAVINGS' ? '1000' : '0'}
                step="100"
                required
              />
            </div>
          </div>

          {accountType === 'CURRENT' && (
            <div className="form-group">
              <label htmlFor="mOd">Overdraft Limit (₹)</label>
              <input
                id="mOd"
                type="number"
                className="form-control"
                value={overdraftLimit}
                onChange={(e) => setOverdraftLimit(e.target.value)}
                min="0"
                step="1000"
              />
              <small className="helper-text">Commercial facility permitting account deficit up to limit.</small>
            </div>
          )}

          <div className="modal-alert">
            {accountType === 'SAVINGS'
              ? 'Savings account policy: Minimum balance of ₹1,000 must be deposited and maintained.'
              : 'Current account policy: Overdraft allows balance to drop below zero up to overdraft limit.'}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}


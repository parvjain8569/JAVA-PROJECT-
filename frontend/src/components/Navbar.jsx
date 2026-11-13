import React from 'react';

/**
 * Navbar Component with Multi-Section Navigation and Global Eye Privacy Toggle.
 */
export default function Navbar({
  currentSection,
  onNavigate,
  isMasked,
  onToggleMask,
  isConnected,
  onOpenModal
}) {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-top">
        <div className="nav-brand" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <h1>Apex Bank</h1>
            <span className="subtext">Transaction & Ledger Simulator</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Privacy Eye Toggle */}
          <button
            type="button"
            className={`btn-privacy-toggle ${isMasked ? 'masked' : 'revealed'}`}
            onClick={onToggleMask}
            title={isMasked ? "Click to reveal balances & account details" : "Click to mask sensitive details"}
          >
            {isMasked ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <span>Details Encrypted</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Details Visible</span>
              </>
            )}
          </button>

          <div className={`status-badge ${isConnected ? 'connected' : 'simulated'}`}>
            <span className="status-dot"></span>
            <span>{isConnected ? 'Java Backend Online' : 'Simulator Mode'}</span>
          </div>

          <button onClick={onOpenModal} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Account
          </button>
        </div>
      </div>

      {/* Multi-Section Navigation Bar */}
      <nav className="section-nav">
        <button
          className={`nav-link ${currentSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Overview
        </button>

        <button
          className={`nav-link ${currentSection === 'accounts' ? 'active' : ''}`}
          onClick={() => onNavigate('accounts')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          Accounts & Cards
        </button>

        <button
          className={`nav-link ${currentSection === 'operations' ? 'active' : ''}`}
          onClick={() => onNavigate('operations')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Transfers & Pay
        </button>

        <button
          className={`nav-link ${currentSection === 'transactions' ? 'active' : ''}`}
          onClick={() => onNavigate('transactions')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Transaction Ledger
        </button>

        <button
          className={`nav-link ${currentSection === 'analytics' ? 'active' : ''}`}
          onClick={() => onNavigate('analytics')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Analytics & Metrics
        </button>
      </nav>
    </header>
  );
}

import React from 'react';
import { formatNumber } from '../utils/helpers';
import './OfflineModal.css';

export default function OfflineModal({ amount, onClaim }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box offline-box">
        <div className="offline-icon">⏳</div>
        <div className="modal-title">Welcome Back!</div>
        <div className="offline-text">While you were away, your auto-clickers earned:</div>
        <div className="offline-amount">+{formatNumber(amount)} Points</div>
        <button className="claim-btn" onClick={onClaim}>Claim</button>
      </div>
    </div>
  );
}

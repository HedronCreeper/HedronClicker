import React, { useState } from 'react';
import './SettingsModal.css';

export default function DeleteConfirm({ onCancel, onDelete }) {
  const [step, setStep] = useState(1);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="confirm-icon">⚠️</div>
            <div className="confirm-title">Delete Progress?</div>
            <div className="confirm-text">
              This will permanently erase all your game data. This action cannot be undone. Are you sure?
            </div>
            <div className="confirm-buttons">
              <button className="confirm-cancel-btn" onClick={onCancel}>Cancel</button>
              <button className="confirm-delete-btn" onClick={() => setStep(2)}>Yes, Delete</button>
            </div>
          </>
        ) : (
          <>
            <div className="confirm-icon">🚨</div>
            <div className="confirm-title">Final Warning</div>
            <div className="confirm-text">
              All your progress, upgrades, and points will be completely wiped. There is no way to recover. Are you absolutely sure?
            </div>
            <div className="confirm-buttons">
              <button className="confirm-cancel-btn" onClick={onCancel}>No, Keep It</button>
              <button className="confirm-delete-btn" onClick={onDelete}>Delete Everything</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

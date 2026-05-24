import React, { useState } from 'react';
import './CratesTab.css';

export default function CratesTab({ gs, openCrate, loot, setLoot }) {
  const [opening, setOpening] = useState(false);
  const canOpen = gs.crateKeys >= 3;

  function handleOpen() {
    if (!canOpen) return;
    setOpening(true);
    setTimeout(() => setOpening(false), 800);
    openCrate();
  }

  return (
    <div className="tab-content-inner">
      <div className="crates-section">
        <div className="crates-header">📦 Crates</div>
        <div className={`crate-card${!canOpen ? ' cant-afford-crate' : ''}`} onClick={handleOpen}>
          <div className={`crate-icon${opening ? ' opening' : ''}`}>🎁</div>
          <div className="crate-name">Mystery Crate</div>
          <div className="crate-cost"><span className="key-icon">🔑</span> 3 Keys</div>
          <button className="open-crate-btn" disabled={!canOpen}>Open</button>
        </div>
      </div>

      {/* Loot Popup */}
      {loot && (
        <div className="loot-overlay" onClick={() => setLoot(null)}>
          <div className="loot-popup" onClick={e => e.stopPropagation()}>
            <div className="loot-title">🎉 Crate Loot!</div>
            <div className="loot-items">
              {loot.map((item, i) => (
                <div
                  key={i}
                  className={`loot-item${item.rarity !== 'normal' ? ' ' + item.rarity : ''}`}
                  style={{ animationDelay: (i * 0.15) + 's' }}
                >
                  {item.text}
                </div>
              ))}
            </div>
            <button className="loot-close-btn" onClick={() => setLoot(null)}>Awesome!</button>
          </div>
        </div>
      )}
    </div>
  );
}

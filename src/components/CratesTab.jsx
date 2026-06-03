import React, { useState } from 'react';
import './CratesTab.css';

const CRATES = [
  { id: 'common', name: 'Common Crate', icon: '📦', cost: 1, color: '#a0f0ff' },
  { id: 'rare', name: 'Rare Crate', icon: '💎', cost: 5, color: '#ff00e5' },
  { id: 'legendary', name: 'Legendary Crate', icon: '👑', cost: 15, color: '#ffd700' },
  { id: 'ultra', name: 'ULTRA Crate', icon: '💫', cost: 50, color: '#ff6b35' },
];

export default function CratesTab({ gs, openCrate, loot, setLoot }) {
  const [opening, setOpening] = useState(null);

  function handleOpen(crateType) {
    const crate = CRATES.find(c => c.id === crateType);
    if (gs.crateKeys < crate.cost) return;
    
    setOpening(crateType);
    setTimeout(() => setOpening(null), 800);
    openCrate(crateType);
  }

  return (
    <div className="tab-content-inner">
      <div className="crates-section">
        <div className="crates-header">📦 Crates</div>
        <div className="crates-grid">
          {CRATES.map(crate => {
            const canAfford = gs.crateKeys >= crate.cost;
            return (
              <div
                key={crate.id}
                className={`crate-card${!canAfford ? ' cant-afford-crate' : ''}`}
                onClick={() => handleOpen(crate.id)}
              >
                <div className={`crate-icon${opening === crate.id ? ' opening' : ''}`}>
                  {crate.icon}
                </div>
                <div className="crate-name">{crate.name}</div>
                <div className="crate-cost">
                  <span className="key-icon">🔑</span> {crate.cost} Key{crate.cost > 1 ? 's' : ''}
                </div>
                <button
                  className="open-crate-btn"
                  disabled={!canAfford}
                  style={{ '--crate-color': crate.color }}
                >
                  Open
                </button>
              </div>
            );
          })}
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
                  className={`loot-item${item.rarity !== 'normal' ? ' ' + item.rarity : ''}${item.isTotal ? ' total' : ''}`}
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

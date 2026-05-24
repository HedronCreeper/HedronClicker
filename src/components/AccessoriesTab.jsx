import React from 'react';
import { formatNumber } from '../utils/helpers';
import './AccessoriesTab.css';

const ACCESSORIES = [
  {
    id: 'cap',
    name: 'Sun Cap 🧢',
    cost: 10000,
    desc: 'Protects your Creeper from sunburn forever. Without it, 3 minutes of sun = burning!',
    icon: '🧢',
    effect: 'Immunity to sun burn',
  },
];

export default function AccessoriesTab({ gs, setGS, showToast, weather, isBurning }) {
  function buyAccessory(acc) {
    if (gs.accessories?.includes(acc.id)) {
      showToast('✅ Already owned!', '');
      return;
    }
    if (gs.points < acc.cost) {
      showToast('❌ Not enough points!', 'error');
      return;
    }
    setGS(prev => ({
      ...prev,
      points: prev.points - acc.cost,
      accessories: [...(prev.accessories || []), acc.id],
    }));
    showToast(`🧢 ${acc.name} purchased!`, 'success');
  }

  return (
    <div className="tab-content-inner">
      <div className="panel-header">🎒 Accessories</div>

      {/* Weather status panel */}
      <div className={`weather-status-panel${weather ? ' weather-' + weather : ''}`}>
        <div className="weather-status-title">Current Weather</div>
        <div className="weather-status-value">
          {!weather    && '🌤️ Clear'}
          {weather === 'sun'          && '☀️ Sunny'}
          {weather === 'rain'         && '🌧️ Raining'}
          {weather === 'thunderstorm' && '⛈️ Thunderstorm'}
        </div>
        {isBurning && (
          <div className="burning-warning">🔥 Creeper is burning! Buy a Sun Cap to protect it!</div>
        )}
      </div>

      {/* Accessory cards */}
      {ACCESSORIES.map(acc => {
        const owned = gs.accessories?.includes(acc.id);
        return (
          <div
            key={acc.id}
            className={`acc-card${owned ? ' owned' : ''}${!owned && gs.points < acc.cost ? ' cant-afford' : ''}`}
            onClick={() => !owned && buyAccessory(acc)}
          >
            <div className="acc-top">
              <div className="acc-icon">{acc.icon}</div>
              <div>
                <div className="acc-name">{acc.name}</div>
                <div className="acc-effect">{acc.effect}</div>
              </div>
              {owned && <div className="acc-owned-badge">✅ Owned</div>}
            </div>
            <div className="acc-desc">{acc.desc}</div>
            {!owned && (
              <div className="acc-bottom">
                <div className="acc-cost">◆ {formatNumber(acc.cost)}</div>
                <button className="buy-btn">Buy</button>
              </div>
            )}
          </div>
        );
      })}

      {/* Weather info panel */}
      <div className="weather-info-panel">
        <div className="weather-info-title">🌦️ Weather System</div>
        <div className="weather-info-row">
          <span>☀️ Sun (50%)</span>
          <span className="weather-info-tip">Burns Creeper after 3min</span>
        </div>
        <div className="weather-info-row">
          <span>🌧️ Rain (30%)</span>
          <span className="weather-info-tip">Shrinks Creeper after 3min</span>
        </div>
        <div className="weather-info-row">
          <span>⛈️ Storm (20%)</span>
          <span className="weather-info-tip">0.1%/s lightning, -90 HP</span>
        </div>
        <div className="weather-info-footer">Weather rolls every 10 min, lasts 5 min</div>
      </div>
    </div>
  );
}

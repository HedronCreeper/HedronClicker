import React from 'react';
import { getSkinSVG } from '../utils/skins.jsx';
import './ClickerArea.css';
import './WeatherLayer.css';

export default function ClickerArea({
  gs, boss, isBossActive, bossShake, bossDying,
  currentMultiplier, creeperHP, handleClick,
  isBurning, isShrunken,
}) {
  const hpPct  = (creeperHP / 100) * 100;
  const hpLow  = creeperHP <= 20;
  const bossPct = boss ? (boss.currentHP / boss.maxHP) * 100 : 100;
  const modClickerImage = gs.mods?.active && gs.mods?.clickerImage;

  return (
    <div className="clicker-boss-area">
      {/* Clicker */}
      <div className="clicker-wrapper">
        <div className="clicker-ring r1" />
        <div className="clicker-ring r2" />
        <div className="clicker-ring r3" />

        <button
          className={`hedron-btn${isShrunken ? ' shrunken' : ''}`}
          onClick={handleClick}
          aria-label="Click to earn points"
        >
          {modClickerImage ? (
            <img className="mod-clicker-image" src={modClickerImage} alt="" />
          ) : (
            getSkinSVG(gs.currentSkin, gs.customSkinColors)
          )}

          {/* Fire overlay when burning */}
          {isBurning && (
            <div className="fire-overlay">
              <div className="flame f1" />
              <div className="flame f2" />
              <div className="flame f3" />
              <div className="flame f4" />
              <div className="flame f5" />
            </div>
          )}
        </button>

        <div className="creeper-hp-container">
          <div className="creeper-hp-bar-bg">
            <div
              className={`creeper-hp-bar-fill${hpLow ? ' low' : ''}`}
              style={{ width: hpPct + '%' }}
            />
          </div>
          <div className={`creeper-hp-text${hpLow ? ' low' : ''}`}>
            {creeperHP} / 100 HP
          </div>
        </div>

        <div className="multiplier-bar-container">
          <div
            className="multiplier-bar-fill"
            style={{ height: ((currentMultiplier - 1.0) / 1.0 * 100) + '%' }}
          />
        </div>
        <div className="multiplier-text">x{currentMultiplier.toFixed(1)}</div>
      </div>

      {/* Boss */}
      {isBossActive && boss && (
        <div className={`boss-container${bossShake ? ' shake' : ''}${bossDying ? ' dying' : ''}`}>
          <div className="boss-label">⚔ BOSS ⚔</div>
          <div className="boss-symbol">{boss.symbol}</div>
          <div className="boss-name">{boss.name}</div>
          <div className="boss-health-bar-wrapper">
            <div className="boss-health-bar-bg">
              <div className="boss-health-bar-fill" style={{ width: bossPct + '%' }} />
            </div>
            <div className="boss-health-text">
              {Math.floor(boss.currentHP).toLocaleString()} / {boss.maxHP.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

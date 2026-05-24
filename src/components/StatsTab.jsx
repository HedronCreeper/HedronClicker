import React from 'react';
import { formatNumber, formatTime } from '../utils/helpers';
import './StatsTab.css';

export default function StatsTab({ gs, isBossActive }) {
  const sessionMs = Date.now() - (gs._sessionStart || Date.now());
  const totalMs = gs.totalTimePlayedMs + sessionMs;

  return (
    <div className="tab-content-inner">
      <div className="panel-header">📊 Statistics</div>
      <div className="stats-grid">
        <div className="stat-row">
          <div className="stat-row-label">Total Points</div>
          <div className="stat-row-value">{formatNumber(gs.points)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Total Clicks</div>
          <div className="stat-row-value">{formatNumber(gs.totalClicks || 0)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Time Played</div>
          <div className="stat-row-value">{formatTime(totalMs)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Bosses Defeated</div>
          <div className="stat-row-value">{gs.bossesDefeated}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Crates Opened</div>
          <div className="stat-row-value">{gs.cratesOpened}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Click Power</div>
          <div className="stat-row-value">{formatNumber(gs.clickPower)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-row-label">Crit Chance</div>
          <div className="stat-row-value">{Math.min(gs.critChance, 100)}%</div>
        </div>
        {gs.critChance >= 50 && (
          <div className="stat-row">
            <div className="stat-row-label">Super Crit Chance</div>
            <div className="stat-row-value">{(gs.superCritChance || 0).toFixed(1)}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

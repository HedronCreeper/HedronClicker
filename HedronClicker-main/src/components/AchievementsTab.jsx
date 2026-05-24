import React from 'react';
import { ACHIEVEMENTS } from '../utils/achievements';
import { formatNumber } from '../utils/helpers';
import './AchievementsTab.css';

export default function AchievementsTab({ gs }) {
  const unlockedList = gs.unlockedAchievements || [];

  return (
    <div className="tab-content-inner achievements-tab-container">
      <div className="panel-header">🏆 Achievements</div>
      
      <div className="achievements-summary">
        <div className="summary-card">
          <span className="summary-title">Unlocked</span>
          <span className="summary-value">
            {unlockedList.length} <span className="summary-slash">/</span> {ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Progress</span>
          <span className="summary-value">
            {Math.round((unlockedList.length / ACHIEVEMENTS.length) * 100 || 0)}%
          </span>
        </div>
      </div>

      <div className="achievements-grid">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedList.includes(ach.id);
          const current = ach.getProgress(gs);
          const target = ach.target;
          const percentage = Math.min(100, Math.max(0, (current / target) * 100));

          return (
            <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-top">
                <div className="achievement-icon-wrapper">
                  <span className="achievement-icon">{isUnlocked ? '🏆' : '🔒'}</span>
                </div>
                <div className="achievement-meta">
                  <div className="achievement-title">{ach.title}</div>
                  <div className="achievement-desc">{ach.desc}</div>
                </div>
              </div>

              <div className="achievement-progress-section">
                <div className="achievement-progress-labels">
                  <span className="progress-value">
                    {formatNumber(current)} / {formatNumber(target)}
                  </span>
                  <span className="progress-percentage">{Math.round(percentage)}%</span>
                </div>
                <div className="achievement-progress-bar-bg">
                  <div 
                    className="achievement-progress-bar-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="achievement-footer">
                <span className="reward-label">Reward</span>
                <span className="reward-badge">🎁 {ach.rewardText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

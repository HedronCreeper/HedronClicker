import React, { useState, useEffect } from 'react';
import { DAILY_BASE_REWARDS } from '../constants';
import { getTodayString, getDailyReward, getNextMidnight, formatNumber, formatTimeRemaining } from '../utils/helpers';
import './DailyModal.css';

export default function DailyModal({ gs, setGS, showToast, onClose }) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const streak = gs.dailyStreak;

  useEffect(() => {
    const tick = () => {
      if (streak.claimedToday) {
        const rem = getNextMidnight() - Date.now();
        if (rem > 0) setTimeRemaining(formatTimeRemaining(rem));
        else setTimeRemaining('');
      } else {
        setTimeRemaining('');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [streak.claimedToday]);

  function claimReward() {
    if (streak.claimedToday) return;
    const reward = getDailyReward(streak.currentDay, streak.currentWeek, DAILY_BASE_REWARDS);
    const today  = getTodayString();
    setGS(prev => ({
      ...prev,
      points: prev.points + reward,
      dailyStreak: {
        ...prev.dailyStreak,
        lastClaimedDate: today,
        claimedToday: true,
      },
    }));
    showToast(`🎁 Daily Reward: +${formatNumber(reward)} points!`, 'success');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box daily-box" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">🎁 Daily Rewards</div>
        <div className="modal-subtitle">Claim your reward every day at midnight!</div>
        <div className="daily-week-label">Week {streak.currentWeek}</div>

        <div className="daily-grid">
          {Array.from({ length: 7 }, (_, i) => {
            const reward    = getDailyReward(i, streak.currentWeek, DAILY_BASE_REWARDS);
            const claimed   = i < streak.currentDay || (i === streak.currentDay && streak.claimedToday);
            const isCurrent = i === streak.currentDay && !streak.claimedToday;
            const future    = !claimed && !isCurrent;
            return (
              <div key={i} className={`daily-day-card${claimed ? ' claimed' : ''}${isCurrent ? ' current' : ''}${future ? ' future' : ''}`}>
                <div className="day-label">Day {i + 1}</div>
                <div className="day-icon">🎁</div>
                <div className="day-reward">{formatNumber(reward)}</div>
                {claimed && <div className="day-check">✅</div>}
              </div>
            );
          })}
        </div>

        <div className="daily-claim-area">
          <button
            className="claim-daily-btn"
            onClick={claimReward}
            disabled={streak.claimedToday}
          >
            {streak.claimedToday ? 'Claimed' : 'Claim'}
          </button>
          {streak.claimedToday && timeRemaining && (
            <div className="claim-timer">Next reward in {timeRemaining}</div>
          )}
          {!streak.claimedToday && (
            <div className="claim-timer">Claim your reward now!</div>
          )}
        </div>
      </div>
    </div>
  );
}

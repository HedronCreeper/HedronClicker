import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { useClicker } from './hooks/useClicker';
import { useToast } from './hooks/useToast';
import { useWeather } from './hooks/useWeather';
import { THEME_VARS } from './constants';
import { formatNumber, applyCSSVars } from './utils/helpers';
import { checkAchievements } from './utils/achievements';
import ClickerArea from './components/ClickerArea.jsx';
import RightPanel from './components/RightPanel.jsx';
import WeatherLayer from './components/WeatherLayer.jsx';
import DailyModal from './components/DailyModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import DeleteConfirm from './components/DeleteConfirm.jsx';
import OfflineModal from './components/OfflineModal.jsx';
import MinigamesModal from './components/MinigamesModal.jsx';
import './App.css';
import './App.extra.css';

export default function App() {
  const { gs, setGS, save, getOfflineIncome, deleteProgress, importState, ready } = useGameState();
  const { toast, showToast } = useToast();

  const [showMinigames, setShowMinigames] = useState(false);

  // Achievement Toast Notification Queue
  const [achievementNotif, setAchievementNotif] = useState(null);
  const notifQueueRef = useRef([]);
  const notifTimeoutRef = useRef(null);

  const processNotifQueue = useCallback(() => {
    if (achievementNotif || notifQueueRef.current.length === 0) return;

    const nextAch = notifQueueRef.current.shift();
    setAchievementNotif(nextAch);

    notifTimeoutRef.current = setTimeout(() => {
      setAchievementNotif(null);
      setTimeout(() => {
        processNotifQueue();
      }, 500);
    }, 4000);
  }, [achievementNotif]);

  const triggerAchievementToast = useCallback((ach) => {
    notifQueueRef.current.push(ach);
    processNotifQueue();
  }, [processNotifQueue]);

  // Check achievements whenever relevant state changes
  useEffect(() => {
    if (!ready) return;
    checkAchievements(gs, setGS, triggerAchievementToast);
  }, [gs.totalClicks, gs.clickPower, gs.cratesOpened, gs.upgrades, ready, triggerAchievementToast]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notifTimeoutRef.current);
    };
  }, []);

  const {
    currentMultiplier, floatTexts, critFlash, handleClick,
    boss, isBossActive, bossShake, bossDying,
    creeperHP, setCreeperHP, creeperHPRef,
  } = useClicker(gs, setGS, showToast, showMinigames);

  const hasCapAccessory = Array.isArray(gs.accessories) && gs.accessories.includes('cap');

  const { weather, isBurning, isShrunken, lightningStrike } = useWeather({
    creeperHPRef,
    setCreeperHP,
    hasCapAccessory,
    showToast,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showDaily,    setShowDaily]    = useState(false);
  const [showDelete,   setShowDelete]   = useState(false);
  const [offlineAmt,   setOfflineAmt]   = useState(0);
  const [autosave,     setAutosave]     = useState(false);
  const autosaveTimer = useRef(null);

  // Apply theme on mount + whenever settings change
  useEffect(() => {
    if (!ready) return;
    const vars = THEME_VARS[gs.settings.theme] || THEME_VARS.default;
    applyCSSVars(vars);
    document.body.classList.toggle('fps-boost', gs.settings.fpsBoost === 'on');
    document.documentElement.style.setProperty('--mod-key-color', gs.mods?.keyColor || '#ffd700');
  }, [gs.settings.theme, gs.settings.fpsBoost, gs.mods?.keyColor, ready]);

  // Offline income — intentionally only runs once after ready
  const offlineChecked = useRef(false);
  useEffect(() => {
    if (!ready || offlineChecked.current) return;
    offlineChecked.current = true;
    const amt = getOfflineIncome(gs);
    if (amt > 0) setOfflineAmt(amt);
  }, [ready, getOfflineIncome, gs]);

  // Autosave indicator flash every 10 s
  useEffect(() => {
    const id = setInterval(() => {
      setAutosave(true);
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => setAutosave(false), 2000);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  function handleClaimOffline() {
    setGS(prev => ({ ...prev, points: prev.points + offlineAmt }));
    setOfflineAmt(0);
    showToast('💰 Offline income claimed!', 'success');
  }

  function handleDelete() {
    deleteProgress();
    setShowDelete(false);
    showToast('🗑 Progress deleted!', 'error');
  }

  if (!ready) {
    return (
      <div style={{
        background: '#0a0a1a', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Orbitron, sans-serif', color: '#00f0ff',
        fontSize: '16px', letterSpacing: '4px',
      }}>
        ⏳ Decrypting save...
      </div>
    );
  }

  const dailyNotif = !gs.dailyStreak.claimedToday;

  return (
    <div className={`app${weather ? ' weather-active-' + weather : ''}`}>
      <div className="bg-gradient" />
      <div className="grid-bg" />
      {gs.settings.fpsBoost !== 'on' && <Particles />}
      {isBossActive && !showMinigames && <div className="boss-warning" />}
      {critFlash && <div className={`crit-flash ${critFlash}`} />}

      <WeatherLayer
        weather={weather}
        isBurning={isBurning}
        isShrunken={isShrunken}
        lightningStrike={lightningStrike}
      />

      {floatTexts.map(f => (
        <div
          key={f.id}
          className={`float-text${f.isCritical === 'super' ? ' super-crit-text' : f.isCritical ? ' crit-text' : ''}`}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}

      <div className="game-title"><span>Hedron</span> Clicker</div>

      <div className="top-right-btns">
        <button className="icon-btn minigames-btn" title="Minigames" onClick={() => setShowMinigames(true)}>
          🎮
        </button>
        <button className="icon-btn daily-btn" title="Daily Rewards" onClick={() => setShowDaily(true)}>
          🎁
          {dailyNotif && <span className="notif-dot" />}
        </button>
        <button className="icon-btn settings-btn-fixed" title="Settings" onClick={() => setShowSettings(true)}>
          ⚙
        </button>
      </div>

      <div className="game-container">
        <div className="main-area">
          <div className="points-display">
            <div className="keys-display"><span className="key-icon">🔑</span> {gs.crateKeys} Key{gs.crateKeys !== 1 ? 's' : ''}</div>
            <div className="points-label">Points</div>
            <div className="points-value">{formatNumber(gs.points)}</div>
          </div>

          <ClickerArea
            gs={gs}
            boss={boss}
            isBossActive={isBossActive && !showMinigames}
            bossShake={bossShake}
            bossDying={bossDying}
            currentMultiplier={currentMultiplier}
            creeperHP={creeperHP}
            handleClick={handleClick}
            isBurning={isBurning}
            isShrunken={isShrunken}
          />

          <div className="stats-panel">
            <div className="stat-item">
              <div className="stat-label">Click Power</div>
              <div className="stat-value">{formatNumber(gs.clickPower)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Per Second</div>
              <div className={`stat-value pps${(isBossActive || showMinigames) ? ' boss-mode' : ''}`}>
                {showMinigames ? 'PAUSED' : isBossActive ? 'PAUSED' : formatNumber(gs.pointsPerSecond)}
              </div>
            </div>
          </div>
        </div>

        <RightPanel
          gs={gs}
          setGS={setGS}
          showToast={showToast}
          creeperHP={creeperHP}
          setCreeperHP={setCreeperHP}
          isBossActive={isBossActive}
          weather={weather}
          isBurning={isBurning}
        />
      </div>

      <div className={`autosave-indicator${autosave ? ' show' : ''}`}>💾 Auto-saving...</div>

      {/* Premium Achievement Toast */}
      {achievementNotif && (
        <div className="achievement-toast show">
          <div className="ach-toast-glow" />
          <div className="ach-toast-content">
            <div className="ach-toast-icon-box">
              <span className="ach-toast-trophy">🏆</span>
            </div>
            <div className="ach-toast-details">
              <div className="ach-toast-unlocked">Achievement Unlocked!</div>
              <div className="ach-toast-title">{achievementNotif.title}</div>
              <div className="ach-toast-reward">🎁 Reward: {achievementNotif.rewardText}</div>
            </div>
          </div>
        </div>
      )}

      <div className={['toast', toast.visible ? 'show' : '', toast.type === 'error' ? 'toast-error' : '', toast.type === 'success' ? 'toast-success' : ''].filter(Boolean).join(' ')}>
        {toast.message}
      </div>

      {offlineAmt > 0 && <OfflineModal amount={offlineAmt} onClaim={handleClaimOffline} />}
      {showDaily && <DailyModal gs={gs} setGS={setGS} showToast={showToast} onClose={() => setShowDaily(false)} />}
      {showSettings && (
        <SettingsModal
          gs={gs} setGS={setGS} showToast={showToast}
          importState={importState}
          onClose={() => setShowSettings(false)}
          onDeleteRequest={() => { setShowSettings(false); setShowDelete(true); }}
        />
      )}
      {showDelete && <DeleteConfirm onCancel={() => setShowDelete(false)} onDelete={handleDelete} />}
      {showMinigames && (
        <MinigamesModal gs={gs} setGS={setGS} showToast={showToast} onClose={() => setShowMinigames(false)} />
      )}
    </div>
  );
}

function Particles() {
  const [particles, setParticles] = React.useState([]);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setParticles(prev => {
        if (prev.length >= 30) return prev;
        const colors   = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)'];
        const size     = 2 + Math.random() * 4;
        const pid      = nextId.current++;
        const duration = 10 + Math.random() * 20;
        const delay    = Math.random() * 3;
        const newP = { id: pid, size, left: Math.random() * 100, color: colors[Math.floor(Math.random() * 3)], duration, delay };
        setTimeout(() => setParticles(p => p.filter(x => x.id !== pid)), (duration + delay) * 1000);
        return [...prev, newP];
      });
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: p.left + '%',
          background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animationDuration: p.duration + 's', animationDelay: p.delay + 's',
        }} />
      ))}
    </div>
  );
}

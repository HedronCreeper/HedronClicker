import { useState, useRef, useCallback, useEffect } from 'react';
import { getMultiplierFromCPS } from '../utils/helpers';
import { BOSS_NAMES, BOSS_SYMBOLS } from '../constants';

export function useClicker(gs, setGS, showToast, isPaused = false) {
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [floatTexts, setFloatTexts] = useState([]);
  const [critFlash, setCritFlash]   = useState(null);
  const clickHistoryRef = useRef([]);
  const multiplierRef   = useRef(1.0);
  const isPausedRef     = useRef(false);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const [boss, setBoss]                 = useState(null);
  const [isBossActive, setIsBossActive] = useState(false);
  const [bossShake, setBossShake]       = useState(false);
  const [bossDying, setBossDying]       = useState(false);
  const bossFailTimerRef   = useRef(null);
  const creeperDmgTimerRef = useRef(null);
  const bossSpawnTimerRef  = useRef(null);
  const bossRewardedRef    = useRef(false);

  const [creeperHP, setCreeperHP] = useState(100);
  const creeperHPRef = useRef(100);

  const isCrit = useCallback(
    () => Math.random() * 100 < Math.min(gs.critChance, 100),
    [gs.critChance]
  );

  const showCritFlash = useCallback((type = 'normal') => {
    setCritFlash(type);
    const ms = type === 'super' ? 260 : 150;
    setTimeout(() => setCritFlash(null), ms);
  }, []);

  const addFloatText = useCallback((text, x, y, isCritical) => {
    const id = Date.now() + Math.random();
    setFloatTexts(prev => [...prev, { id, text, x, y, isCritical }]);
    setTimeout(() => setFloatTexts(prev => prev.filter(f => f.id !== id)), 1000);
  }, []);

  const updateMultiplier = useCallback(() => {
    const now = Date.now();
    clickHistoryRef.current.push(now);
    clickHistoryRef.current = clickHistoryRef.current.filter(t => now - t < 1000);
    const target = getMultiplierFromCPS(clickHistoryRef.current.length);
    multiplierRef.current += (target - multiplierRef.current) * 0.15;
    multiplierRef.current  = Math.min(2.0, Math.max(1.0, multiplierRef.current));
    setCurrentMultiplier(multiplierRef.current);
  }, []);

  // Multiplier decay
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      clickHistoryRef.current = clickHistoryRef.current.filter(t => now - t < 1000);
      if (clickHistoryRef.current.length === 0 && multiplierRef.current > 1.0) {
        multiplierRef.current = Math.max(1.0, multiplierRef.current - 0.03);
        setCurrentMultiplier(multiplierRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ── Boss system ───────────────────────────────────────────────────────────

  const startCreeperDamage = useCallback(() => {
    showToast('⚠️ Boss too strong! Creeper taking damage!', 'error');
    clearInterval(creeperDmgTimerRef.current);
    creeperDmgTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      creeperHPRef.current = Math.max(0, creeperHPRef.current - 1);
      setCreeperHP(creeperHPRef.current);
      if (creeperHPRef.current <= 0) {
        clearInterval(creeperDmgTimerRef.current);
        localStorage.clear();
        window.location.reload();
      }
    }, 1000);
  }, [showToast]);

  // Use a ref for scheduleNextBoss so it can self-reference without circular deps
  const scheduleNextBossRef = useRef(null);
  scheduleNextBossRef.current = function scheduleNextBoss() {
    clearTimeout(bossSpawnTimerRef.current);
    bossSpawnTimerRef.current = setTimeout(() => {
      if (isPausedRef.current) {
        bossSpawnTimerRef.current = setTimeout(scheduleNextBossRef.current, 5000);
        return;
      }
      setGS(prev => {
        const hp      = Math.max(1, Math.floor((prev.clickPower || 1) * 300));
        const nameIdx = Math.floor(Math.random() * BOSS_NAMES.length);
        const symIdx  = Math.floor(Math.random() * BOSS_SYMBOLS.length);
        const newBoss = { name: BOSS_NAMES[nameIdx], symbol: BOSS_SYMBOLS[symIdx], maxHP: hp, currentHP: hp };
        bossRewardedRef.current = false;
        setBoss(newBoss);
        setIsBossActive(true);
        clearTimeout(bossFailTimerRef.current);
        bossFailTimerRef.current = setTimeout(() => startCreeperDamage(), 30000);
        return prev;
      });
    }, 120000);
  };

  const defeatBoss = useCallback((setGSFn) => {
    if (bossRewardedRef.current) return;
    bossRewardedRef.current = true;
    const lootPoints = 1000000;
    clearTimeout(bossFailTimerRef.current);
    clearInterval(creeperDmgTimerRef.current);
    setBossDying(true);
    setTimeout(() => {
      setBoss(null);
      setIsBossActive(false);
      setBossDying(false);
      setGSFn(prev => ({
        ...prev,
        points:         prev.points + lootPoints,
        crateKeys:      prev.crateKeys + 1,
        bossesDefeated: prev.bossesDefeated + 1,
      }));
      showToast(`⚔ Boss defeated! +${Math.floor(lootPoints).toLocaleString()} pts, +1 🔑`, 'success');
      scheduleNextBossRef.current();
    }, 800);
  }, [showToast]);

  const hitBoss = useCallback((e) => {
    if (!boss) return;
    const baseDamage = gs.clickPower * multiplierRef.current;
    const crit   = isCrit();
    const superCrit = crit && (Math.random() * 100 < (gs.superCritChance || 0));
    const damage = superCrit ? baseDamage * 10 : (crit ? baseDamage * 2 : baseDamage);
    setBoss(prev => {
      if (!prev) return null;
      const newHP = Math.max(0, prev.currentHP - damage);
      setBossShake(true);
      setTimeout(() => setBossShake(false), 150);
      const rect = e.currentTarget?.closest?.('.boss-container')?.getBoundingClientRect?.()
        ?? { left: window.innerWidth - 200, top: 200, width: 180 };
      addFloatText(
        (superCrit ? '💥SUPER CRIT! ' : (crit ? '💥CRIT! ' : '')) + '-' + Math.floor(damage),
        rect.left + rect.width / 2 + (Math.random() * 40 - 20),
        rect.top + 40,
        superCrit ? 'super' : crit
      );
      if (superCrit) {
        showCritFlash('super');
      } else if (crit) {
        showCritFlash('normal');
      }
      if (newHP <= 0) { defeatBoss(setGS); return { ...prev, currentHP: 0 }; }
      return { ...prev, currentHP: newHP };
    });
  }, [boss, gs.clickPower, gs.superCritChance, isCrit, addFloatText, showCritFlash, defeatBoss, setGS]);

  const handleClick = useCallback((e) => {
    if (isPausedRef.current) return;
    updateMultiplier();
    if (isBossActive) {
      setGS(prev => ({ ...prev, totalClicks: (prev.totalClicks || 0) + 1 }));
      hitBoss(e);
      return;
    }
    const base   = gs.clickPower * multiplierRef.current;
    const crit   = isCrit();
    const superCrit = crit && (Math.random() * 100 < (gs.superCritChance || 0));
    const gained = superCrit ? base * 10 : (crit ? base * 2 : base);
    setGS(prev => ({
      ...prev,
      totalClicks: (prev.totalClicks || 0) + 1,
      points: prev.points + gained
    }));
    addFloatText(
      (superCrit ? '💥SUPER CRIT! ' : (crit ? '💥CRIT! ' : '')) + '+' + Math.floor(gained),
      e.clientX - 20,
      e.clientY - 30,
      superCrit ? 'super' : crit
    );
    if (superCrit) {
      showCritFlash('super');
    } else if (crit) {
      showCritFlash('normal');
    }
  }, [updateMultiplier, isBossActive, hitBoss, gs.clickPower, gs.superCritChance, isCrit, setGS, addFloatText, showCritFlash]);

  // Auto-clicker — pauses when minigames open
  useEffect(() => {
    const id = setInterval(() => {
      if (isPausedRef.current || isBossActive) return;
      setGS(prev => {
        if (prev.pointsPerSecond > 0)
          return { ...prev, points: prev.points + prev.pointsPerSecond / 10 };
        return prev;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isBossActive, setGS]);

  // Mount — schedule first boss, clean up on unmount
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    scheduleNextBossRef.current();
    return () => {
      clearTimeout(bossSpawnTimerRef.current);
      clearTimeout(bossFailTimerRef.current);
      clearInterval(creeperDmgTimerRef.current);
    };
  }, []);

  return {
    currentMultiplier, floatTexts, critFlash, handleClick,
    boss, isBossActive, bossShake, bossDying,
    creeperHP, setCreeperHP, creeperHPRef,
  };
}

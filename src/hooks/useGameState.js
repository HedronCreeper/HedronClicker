import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_UPGRADES } from '../constants';
import { getTodayString, getNextMidnight } from '../utils/helpers';
import { encryptState, decryptState } from '../utils/crypto';

const SAVE_KEY = 'hedronClicker_v2';

function makeDefaultState() {
  return {
    points: 0,
    clickPower: 1,
    pointsPerSecond: 0,
    critChance: 0,
    superCritChance: 0,
    crateKeys: 0,
    gems: 0,
    bossesDefeated: 0,
    cratesOpened: 0,
    totalClicks: 0,
    unlockedAchievements: [],
    lastSaveTime: Date.now(),
    totalTimePlayedMs: 0,
    mods: { active: false, clickerImage: null, keyColor: '#ffd700', name: null, importedAt: null },
    accessories: [],
    minigamesUnlocked: false,
    unlockedGames: [],
    dailyStreak: {
      currentDay: 0,
      currentWeek: 1,
      lastClaimedDate: null,
      claimedToday: false,
    },
    upgrades: DEFAULT_UPGRADES.map(u => ({ ...u })),
    settings: { theme: 'default', fpsBoost: 'off' },
  };
}

function mergeState(saved) {
  const def = makeDefaultState();
  const merged = {
    ...def,
    ...saved,
    dailyStreak:      { ...def.dailyStreak,      ...(saved.dailyStreak      || {}) },
    settings:         { ...def.settings,          ...(saved.settings         || {}) },
    mods:             { ...def.mods,              ...(saved.mods             || {}) },
    accessories:      saved.accessories           ?? def.accessories,
    unlockedGames:    saved.unlockedGames         ?? def.unlockedGames,
    gems:             saved.gems                  ?? def.gems,
    minigamesUnlocked: saved.minigamesUnlocked    ?? def.minigamesUnlocked,
    totalClicks:      saved.totalClicks           ?? def.totalClicks,
    superCritChance:  saved.superCritChance       ?? def.superCritChance,
    unlockedAchievements: saved.unlockedAchievements ?? def.unlockedAchievements,
    upgrades: def.upgrades.map((du) => {
      const su = (saved.upgrades || []).find(u => u.name === du.name);
      if (!su) return du;
      return { ...du, level: su.level ?? du.level, cost: su.cost ?? du.cost };
    }),
  };
  // Cleanup legacy skin params if they exist
  delete merged.ownedSkins;
  delete merged.currentSkin;
  delete merged.customSkinColors;
  return merged;
}

async function saveToStorage(state) {
  try {
    const enc = await encryptState(state);
    localStorage.setItem(SAVE_KEY, enc);
  } catch (e) {
    console.warn('Encryption failed, storing raw:', e);
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }
}

async function loadFromStorage() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return await decryptState(raw);
  } catch (_) {
    try {
      return JSON.parse(raw);
    } catch (__) {
      return null;
    }
  }
}

export function useGameState() {
  const [gs, setGS]       = useState(makeDefaultState);
  const [ready, setReady] = useState(false);
  const sessionStart      = useRef(Date.now());
  const loadedOnce        = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    loadFromStorage().then(saved => {
      if (saved) setGS(mergeState(saved));
      setReady(true);
    });
  }, []);

  const saveTimer = useRef(null);
  useEffect(() => {
    if (!ready) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToStorage(gs), 2000);
  }, [gs, ready]);

  const save = useCallback((state) => {
    const currentMs = Date.now() - sessionStart.current;
    const toSave = {
      ...state,
      totalTimePlayedMs: state.totalTimePlayedMs + currentMs,
      lastSaveTime: Date.now(),
    };
    sessionStart.current = Date.now();
    saveToStorage(toSave);
    return toSave;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setGS(prev => {
        const saved = save(prev);
        return { ...prev, totalTimePlayedMs: saved.totalTimePlayedMs, lastSaveTime: saved.lastSaveTime };
      });
    }, 10000);
    return () => clearInterval(id);
  }, [save, ready]);

  const checkDailyStreak = useCallback((streak) => {
    const today = getTodayString();
    const s = { ...streak };
    if (!s.lastClaimedDate) { s.currentDay = 0; s.currentWeek = 1; s.claimedToday = false; return s; }
    if (s.lastClaimedDate === today) { s.claimedToday = true; return s; }
    const lastDate  = new Date(s.lastClaimedDate + 'T00:00:00');
    const todayDate = new Date(today + 'T00:00:00');
    const diffDays  = Math.round((todayDate - lastDate) / 86400000);
    if (diffDays === 1) {
      s.claimedToday = false;
      s.currentDay++;
      if (s.currentDay >= 7) { s.currentDay = 0; s.currentWeek++; }
    } else if (diffDays > 1) {
      s.currentDay = 0; s.currentWeek = 1; s.claimedToday = false;
    }
    return s;
  }, []);

  useEffect(() => {
    if (!ready) return;
    setGS(prev => ({ ...prev, dailyStreak: checkDailyStreak(prev.dailyStreak) }));
  }, [checkDailyStreak, ready]);

  useEffect(() => {
    const scheduleReset = () => {
      const msUntilMidnight = getNextMidnight() - Date.now();
      const id = setTimeout(() => {
        setGS(prev => {
          const s = { ...prev.dailyStreak };
          s.claimedToday = false;
          s.currentDay++;
          if (s.currentDay >= 7) { s.currentDay = 0; s.currentWeek++; }
          return { ...prev, dailyStreak: s };
        });
        scheduleReset();
      }, msUntilMidnight + 100);
      return id;
    };
    const id = scheduleReset();
    return () => clearTimeout(id);
  }, []);

  const getOfflineIncome = useCallback((state) => {
    const diff = (Date.now() - state.lastSaveTime) / 1000;
    if (diff > 10 && state.pointsPerSecond > 0) return Math.floor(diff * state.pointsPerSecond);
    return 0;
  }, []);

  const deleteProgress = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setGS(makeDefaultState());
    sessionStart.current = Date.now();
  }, []);

  const importState = useCallback(async (parsed) => {
    const merged = mergeState(parsed);
    clearTimeout(saveTimer.current);
    setGS(merged);
    await saveToStorage(merged);
    sessionStart.current = Date.now();
  }, []);

  return { gs, setGS, save, checkDailyStreak, getOfflineIncome, deleteProgress, importState, ready };
}
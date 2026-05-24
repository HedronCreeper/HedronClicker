// Utility functions

export function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9)  return (num / 1e9).toFixed(1)  + 'B';
  if (num >= 1e6)  return (num / 1e6).toFixed(1)  + 'M';
  if (num >= 1e3)  return (num / 1e3).toFixed(1)  + 'K';
  return Math.floor(num).toString();
}

export function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export function formatTimeRemaining(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function getNextMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime();
}

export function getDailyReward(dayIndex, week, baseRewards) {
  return Math.floor(baseRewards[dayIndex] * Math.pow(1.5, week - 1));
}

export function getMultiplierFromCPS(cps) {
  if (cps <= 8)  return 1.0;
  if (cps >= 15) return 2.0;
  if (cps <= 10) return 1.0 + ((cps - 8) / 2) * 0.4;
  if (cps <= 12) return 1.4 + ((cps - 10) / 2) * 0.4;
  return 1.8 + ((cps - 12) / 3) * 0.2;
}

export function applyCSSVars(vars) {
  const root = document.documentElement;
  root.style.setProperty('--bg-primary',    vars.bg);
  root.style.setProperty('--bg-secondary',  vars.bg2);
  root.style.setProperty('--bg-panel',      vars.panel);
  root.style.setProperty('--accent-1',      vars.a1);
  root.style.setProperty('--accent-2',      vars.a2);
  root.style.setProperty('--accent-3',      vars.a3);
  root.style.setProperty('--accent-4',      vars.a4);
  root.style.setProperty('--text-primary',  vars.text);
  root.style.setProperty('--text-secondary',vars.text2);
}

// Gems: 1 gem = 10,000 points
export const GEMS_TO_POINTS = 10000;
export function gemsToPoints(gems) { return gems * GEMS_TO_POINTS; }
export function pointsToGems(pts)  { return Math.floor(pts / GEMS_TO_POINTS); }

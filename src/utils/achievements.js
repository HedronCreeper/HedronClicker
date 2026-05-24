// Achievements definition and checking utility for HedronClicker

export const ACHIEVEMENTS = [
  {
    id: 'first_click',
    title: 'First Click',
    desc: 'Take your first step into the Hedron universe by clicking the core.',
    rewardText: '100 pts',
    target: 1,
    getProgress: (s) => s.totalClicks || 0,
    condition: (s) => (s.totalClicks || 0) >= 1,
    applyReward: (s) => ({ ...s, points: s.points + 100 }),
  },
  {
    id: 'clicks_10',
    title: 'Click Novice',
    desc: 'Click the Hedron 10 times. Consistency is key!',
    rewardText: '200 pts',
    target: 10,
    getProgress: (s) => s.totalClicks || 0,
    condition: (s) => (s.totalClicks || 0) >= 10,
    applyReward: (s) => ({ ...s, points: s.points + 200 }),
  },
  {
    id: 'clicks_1k',
    title: 'Click Enthusiast',
    desc: 'Reach a milestone of 1,000 clicks. The journey continues.',
    rewardText: '1,000 pts',
    target: 1000,
    getProgress: (s) => s.totalClicks || 0,
    condition: (s) => (s.totalClicks || 0) >= 1000,
    applyReward: (s) => ({ ...s, points: s.points + 1000 }),
  },
  {
    id: 'clicks_10k',
    title: 'Click Professional',
    desc: 'Unleash 10,000 clicks. You are becoming a force to be reckoned with.',
    rewardText: '1,000,000 pts',
    target: 10000,
    getProgress: (s) => s.totalClicks || 0,
    condition: (s) => (s.totalClicks || 0) >= 10000,
    applyReward: (s) => ({ ...s, points: s.points + 1000000 }),
  },
  {
    id: 'clicks_1m',
    title: 'Click Legend',
    desc: 'Achieve the ultimate status with 1,000,000 clicks! Legendary!',
    rewardText: '1,000,000,000 pts',
    target: 1000000,
    getProgress: (s) => s.totalClicks || 0,
    condition: (s) => (s.totalClicks || 0) >= 1000000,
    applyReward: (s) => ({ ...s, points: s.points + 1000000000 }),
  },
  {
    id: 'auto_clicker',
    title: 'Auto Clicker',
    desc: 'Afford an Auto Clicker for the first time.',
    rewardText: '100 pts',
    target: 1,
    getProgress: (s) => s.upgrades?.[1]?.level || 0,
    condition: (s) => (s.upgrades?.[1]?.level || 0) >= 1,
    applyReward: (s) => ({ ...s, points: s.points + 100 }),
  },
  {
    id: 'power_c',
    title: 'Power C',
    desc: 'Reach click power 100. Every single click packs a punch!',
    rewardText: '+10 Click Power',
    target: 100,
    getProgress: (s) => s.clickPower || 0,
    condition: (s) => (s.clickPower || 0) >= 100,
    applyReward: (s) => ({ ...s, clickPower: s.clickPower + 10 }),
  },
  {
    id: 'crate_master',
    title: 'Crate Master',
    desc: 'Open 100 crates to crack high-value loot.',
    rewardText: '1,000,000 pts',
    target: 100,
    getProgress: (s) => s.cratesOpened || 0,
    condition: (s) => (s.cratesOpened || 0) >= 100,
    applyReward: (s) => ({ ...s, points: s.points + 1000000 }),
  },
  {
    id: 'faster_clicks_pro',
    title: 'Faster Clicks PRO',
    desc: 'Afford the upgrade Faster Clicks Pro 200 times.',
    rewardText: '1M points',
    target: 200,
    getProgress: (s) => s.upgrades?.find(u => u.name === 'Faster Clicks Pro')?.level || 0,
    condition: (s) => (s.upgrades?.find(u => u.name === 'Faster Clicks Pro')?.level || 0) >= 200,
    applyReward: (s) => ({ ...s, points: s.points + 1000000 }),
  }
];

export function checkAchievements(gs, setGS, onUnlock) {
  let unlockedNew = [];
  setGS(prev => {
    const currentUnlocked = prev.unlockedAchievements || [];
    let stateChanged = false;
    let nextState = { ...prev };

    for (const ach of ACHIEVEMENTS) {
      if (!currentUnlocked.includes(ach.id) && ach.condition(prev)) {
        unlockedNew.push(ach);
        nextState = ach.applyReward(nextState);
        nextState.unlockedAchievements = [...(nextState.unlockedAchievements || []), ach.id];
        stateChanged = true;
      }
    }

    return stateChanged ? nextState : prev;
  });

  unlockedNew.forEach(ach => {
    if (onUnlock) onUnlock(ach);
  });
}
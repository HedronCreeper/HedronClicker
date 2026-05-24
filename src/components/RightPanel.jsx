import React, { useState } from 'react';
import { formatNumber, GEMS_TO_POINTS } from '../utils/helpers';
import { getDefaultHedronSVG } from '../utils/skins.jsx';
import UpgradesTab from './UpgradesTab.jsx';
import StatsTab from './StatsTab.jsx';
import CratesTab from './CratesTab.jsx';
import AccessoriesTab from './AccessoriesTab.jsx';
import AchievementsTab from './AchievementsTab.jsx';
import './RightPanel.css';

const TABS       = ['upgrades', 'stats', 'crates', 'gear', 'achievements'];
const TAB_LABELS = ['Upgrades', 'Stats', 'Crates', 'Gear', 'Achievements'];

export default function RightPanel({
  gs, setGS, showToast,
  creeperHP, setCreeperHP,
  isBossActive,
  weather, isBurning,
}) {
  const [activeTab, setActiveTab] = useState('upgrades');
  const [loot, setLoot] = useState(null);

  function openCrate() {
    if (gs.crateKeys < 3) return;
    const lootItems = [];
    lootItems.push({ text: '+10,000 Points', points: 10000, rarity: 'normal' });
    if (Math.random() < 0.5) lootItems.push({ text: '+20,000 Points', points: 20000, rarity: 'normal' });
    if (Math.random() < 0.5) lootItems.push({ text: '+1 Crate Key 🔑', points: 0, keys: 1, rarity: 'rare' });
    if (Math.random() < 0.1)  lootItems.push({ text: '+100,000 Points!', points: 100000, rarity: 'rare' });
    if (Math.random() < 0.01) lootItems.push({ text: '🌟 +1,000,000 POINTS! 🌟', points: 1000000, rarity: 'legendary' });
    const totalPts  = lootItems.reduce((a, b) => a + (b.points || 0), 0);
    const totalKeys = lootItems.reduce((a, b) => a + (b.keys || 0), 0);
    setGS(prev => ({
      ...prev,
      crateKeys: prev.crateKeys - 3 + totalKeys,
      points: prev.points + totalPts,
      cratesOpened: prev.cratesOpened + 1,
    }));
    setLoot(lootItems);
  }

  function buyGems(amount) {
    const cost = amount * GEMS_TO_POINTS;
    if (gs.points < cost) { showToast('❌ Not enough points!', 'error'); return; }
    setGS(prev => ({ ...prev, points: prev.points - cost, gems: (prev.gems || 0) + amount }));
    showToast(`💎 Purchased ${amount} gem${amount > 1 ? 's' : ''}!`, 'success');
  }

  return (
    <div className="right-panel">
      <div className="gem-bar">
        <span className="gem-bar-icon">💎</span>
        <span className="gem-bar-count">{gs.gems || 0} Gems</span>
        <span className="gem-bar-rate">1 gem = {formatNumber(GEMS_TO_POINTS)} pts</span>
      </div>

      <div className="tab-navigation">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`tab-btn${activeTab === t ? ' active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {TAB_LABELS[i]}
          </button>
        ))}
      </div>

      {activeTab === 'upgrades' && (
        <UpgradesTab
          gs={gs} setGS={setGS} showToast={showToast}
          creeperHP={creeperHP} setCreeperHP={setCreeperHP}
        />
      )}

      {activeTab === 'stats' && <StatsTab gs={gs} isBossActive={isBossActive} />}

      {activeTab === 'crates' && (
        <CratesTab gs={gs} openCrate={openCrate} loot={loot} setLoot={setLoot} />
      )}

      {activeTab === 'gear' && (
        <AccessoriesTab
          gs={gs} setGS={setGS} showToast={showToast}
          weather={weather} isBurning={isBurning}
        />
      )}

      {activeTab === 'achievements' && (
        <AchievementsTab gs={gs} />
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { formatNumber } from '../utils/helpers';
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

  function openCrate(crateType) {
    const crateCosts = { common: 1, rare: 5, legendary: 15, ultra: 50 };
    const cost = crateCosts[crateType] || 1;
    
    if (gs.crateKeys < cost) return;
    
    const lootItems = [];
    let totalPts = 0;
    let totalKeys = 0;
    
    if (crateType === 'common') {
      lootItems.push({ text: '+1,000 Points', points: 1000, rarity: 'normal' });
      totalPts = 1000;
      if (Math.random() < 0.1) {
        lootItems.push({ text: '+10,000 Points', points: 10000, rarity: 'rare' });
        totalPts += 10000;
      }
    } else if (crateType === 'rare') {
      lootItems.push({ text: '+10,000 Points', points: 10000, rarity: 'normal' });
      totalPts = 10000;
      if (Math.random() < 0.5) {
        lootItems.push({ text: '+20,000 Points', points: 20000, rarity: 'normal' });
        totalPts += 20000;
      }
      if (Math.random() < 0.25) {
        lootItems.push({ text: '+50,000 Points', points: 50000, rarity: 'rare' });
        totalPts += 50000;
      }
      if (Math.random() < 0.1) {
        lootItems.push({ text: '+75,000 Points', points: 75000, rarity: 'rare' });
        totalPts += 75000;
      }
    } else if (crateType === 'legendary') {
      lootItems.push({ text: '+100,000 Points', points: 100000, rarity: 'normal' });
      totalPts = 100000;
      if (Math.random() < 0.75) {
        lootItems.push({ text: '+125,000 Points', points: 125000, rarity: 'rare' });
        totalPts += 125000;
      }
      if (Math.random() < 0.5) {
        lootItems.push({ text: '+1 Crate Key 🔑', points: 0, keys: 1, rarity: 'rare' });
        totalKeys += 1;
      }
      if (Math.random() < 0.5) {
        lootItems.push({ text: '+150,000 Points', points: 150000, rarity: 'rare' });
        totalPts += 150000;
      }
      if (Math.random() < 0.25) {
        lootItems.push({ text: '+200,000 Points', points: 200000, rarity: 'legendary' });
        totalPts += 200000;
      }
      if (Math.random() < 0.1) {
        lootItems.push({ text: '+250,000 Points', points: 250000, rarity: 'legendary' });
        totalPts += 250000;
      }
      if (Math.random() < 0.01) {
        lootItems.push({ text: '+500,000 Points', points: 500000, rarity: 'legendary' });
        totalPts += 500000;
      }
    } else if (crateType === 'ultra') {
      lootItems.push({ text: '+500,000 Points', points: 500000, rarity: 'normal' });
      totalPts = 500000;
      if (Math.random() < 0.75) {
        lootItems.push({ text: '+600,000 Points', points: 600000, rarity: 'rare' });
        totalPts += 600000;
      }
      if (Math.random() < 0.5) {
        lootItems.push({ text: '+750,000 Points', points: 750000, rarity: 'rare' });
        totalPts += 750000;
      }
      if (Math.random() < 0.25) {
        lootItems.push({ text: '+750,000 Points', points: 750000, rarity: 'rare' });
        totalPts += 750000;
      }
      if (Math.random() < 0.1) {
        lootItems.push({ text: '+1,000,000 Points', points: 1000000, rarity: 'legendary' });
        totalPts += 1000000;
      }
      if (Math.random() < 0.01) {
        lootItems.push({ text: '🌟 +10,000,000 POINTS! 🌟', points: 10000000, rarity: 'legendary' });
        totalPts += 10000000;
      }
      if (Math.random() < 0.001) {
        lootItems.push({ text: '💫 +100,000,000 POINTS! 💫', points: 100000000, rarity: 'legendary' });
        totalPts += 100000000;
      }
    }
    
    lootItems.push({ text: `Total: ${formatNumber(totalPts)} points`, points: 0, rarity: 'total', isTotal: true });
    
    setGS(prev => ({
      ...prev,
      crateKeys: prev.crateKeys - cost + totalKeys,
      points: prev.points + totalPts,
      cratesOpened: prev.cratesOpened + 1,
    }));
    setLoot(lootItems);
  }

  return (
    <div className="right-panel">

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
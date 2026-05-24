import React, { useState } from 'react';
import { SKINS } from '../constants';
import { formatNumber, GEMS_TO_POINTS } from '../utils/helpers';
import { getSkinSVG } from '../utils/skins.jsx';
import UpgradesTab from './UpgradesTab.jsx';
import StatsTab from './StatsTab.jsx';
import CratesTab from './CratesTab.jsx';
import AccessoriesTab from './AccessoriesTab.jsx';
import AchievementsTab from './AchievementsTab.jsx';
import './RightPanel.css';

const TABS       = ['upgrades', 'stats', 'crates', 'skins', 'gear', 'achievements'];
const TAB_LABELS = ['Upgrades', 'Stats', 'Crates', 'Skins', 'Gear', 'Achievements'];

export default function RightPanel({
  gs, setGS, showToast,
  creeperHP, setCreeperHP,
  isBossActive,
  weather, isBurning,
}) {
  const [activeTab, setActiveTab] = useState('upgrades');
  const [loot, setLoot] = useState(null);
  const [customBody, setCustomBody] = useState(gs.customSkinColors?.body || '#00AA00');
  const [customFace, setCustomFace] = useState(gs.customSkinColors?.face || '#000000');

  function buySkin(skin) {
    if (gs.points >= skin.cost) {
      setGS(prev => ({
        ...prev,
        points: prev.points - skin.cost,
        ownedSkins: [...prev.ownedSkins, skin.id],
      }));
      showToast('🎨 Skin purchased: ' + skin.name, 'success');
    } else {
      showToast('❌ Not enough points!', 'error');
    }
  }

  function equipSkin(id) {
    setGS(prev => ({ ...prev, currentSkin: id }));
    showToast('🎨 Skin equipped!', 'success');
  }

  function applyCustomSkin() {
    setGS(prev => ({
      ...prev,
      currentSkin: 'custom',
      customSkinColors: { body: customBody, face: customFace },
    }));
    showToast('🎨 Custom skin applied!', 'success');
  }

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

  // Gems shop helpers
  function buyGems(amount) {
    const cost = amount * GEMS_TO_POINTS;
    if (gs.points < cost) { showToast('❌ Not enough points!', 'error'); return; }
    setGS(prev => ({ ...prev, points: prev.points - cost, gems: (prev.gems || 0) + amount }));
    showToast(`💎 Purchased ${amount} gem${amount > 1 ? 's' : ''}!`, 'success');
  }

  return (
    <div className="right-panel">
      {/* Gem display */}
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

      {activeTab === 'skins' && (
        <div className="tab-content-inner">
          <div className="panel-header">🎨 Skins</div>
          {/* Gem shop in skins tab */}
          <div className="gem-shop-panel">
            <div className="gem-shop-title">💎 Buy Gems</div>
            <div className="gem-shop-row">
              {[1,5,10].map(n => (
                <button
                  key={n}
                  className={`gem-buy-btn${gs.points < n * GEMS_TO_POINTS ? ' cant-afford' : ''}`}
                  onClick={() => buyGems(n)}
                >
                  {n} 💎<br/>
                  <span className="gem-buy-cost">{formatNumber(n * GEMS_TO_POINTS)} pts</span>
                </button>
              ))}
            </div>
          </div>
          <div className="skin-grid">
            {SKINS.map(skin => {
              const owned  = gs.ownedSkins.includes(skin.id);
              const active = gs.currentSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  className={`skin-card${active ? ' active' : ''}${!owned ? ' locked' : ''}`}
                  onClick={() => {
                    if (!owned) buySkin(skin);
                    else if (skin.id !== 'custom') equipSkin(skin.id);
                  }}
                >
                  <div className="skin-preview">{getSkinSVG(skin.id, gs.customSkinColors)}</div>
                  <div className="skin-name">{skin.name}</div>
                  {owned ? (
                    <>
                      <div className="skin-owned">Owned</div>
                      {skin.id === 'custom' && (
                        <div className="custom-editor" onClick={e => e.stopPropagation()}>
                          <div className="color-picker-row">
                            <span className="color-picker-label">Body</span>
                            <input type="color" value={customBody} onChange={e => setCustomBody(e.target.value)} />
                          </div>
                          <div className="color-picker-row">
                            <span className="color-picker-label">Face</span>
                            <input type="color" value={customFace} onChange={e => setCustomFace(e.target.value)} />
                          </div>
                          <button className="apply-skin-btn" onClick={applyCustomSkin}>Apply & Equip</button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="skin-price">{formatNumber(skin.cost)} pts</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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

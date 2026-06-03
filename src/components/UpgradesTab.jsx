import React from "react";
import { UPGRADE_ICONS, UPGRADE_ICON_TYPES, UPGRADE_DESCS } from "../constants";
import { formatNumber } from "../utils/helpers";
import "./UpgradesTab.css";

export default function UpgradesTab({
  gs,
  setGS,
  showToast,
  creeperHP,
  setCreeperHP,
}) {
  function buyUpgrade(index) {
    const upg = gs.upgrades[index];
    if (gs.points < upg.cost) return;

    if (upg.type === "crit" && upg.level >= 100) {
      showToast("💥 Critical Chance already at max (100%)!", "error");
      return;
    }

    if (upg.type === "super_crit" && gs.critChance < 50) {
      showToast(
        "🔒 Super Critical Hit is locked! Reach 50% Critical Chance first.",
        "error",
      );
      return;
    }

    if (upg.type === "heal") {
      if (creeperHP >= 100) {
        showToast("❤️ Creeper is already at full HP!", "error");
        return;
      }
      setGS((prev) => ({ ...prev, points: prev.points - upg.cost }));
      setCreeperHP((h) => Math.min(100, h + 1));
      showToast(
        `❤️ Creeper healed! HP: ${Math.min(100, creeperHP + 1)}/100`,
        "success",
      );
      return;
    }

    setGS((prev) => {
      const upgrades = prev.upgrades.map((u, i) => {
        if (i !== index) return u;
        const newLevel = u.level + 1;
        const newCost = Math.floor(u.baseCost * Math.pow(1.2, newLevel));
        return { ...u, level: newLevel, cost: newCost };
      });
      let { clickPower, pointsPerSecond, critChance, superCritChance } = prev;
      const u = gs.upgrades[index];
      const upgradedItem = upgrades[index];
      if (u.type === "click") clickPower += u.effect;
      if (u.type === "click_pro") clickPower += u.effect; // Handle new upgrade type
      if (u.type === "auto") pointsPerSecond += u.effect;
      if (u.type === "crit") critChance = Math.min(upgradedItem.level, 100);
      if (u.type === "super_crit") superCritChance = upgradedItem.level * 0.1;
      return {
        ...prev,
        points: prev.points - upg.cost,
        upgrades,
        clickPower,
        pointsPerSecond,
        critChance,
        superCritChance,
      };
    });
  }

  return (
    <div className="tab-content-inner">
      {gs.upgrades.map((upg, i) => {
        const canAfford = gs.points >= upg.cost;
        const isSuperCrit = upg.type === "super_crit";
        const isLocked = isSuperCrit && gs.critChance < 50;

        if (isLocked) {
          return (
            <div key={i} className="upgrade-card locked-upgrade">
              <div className="locked-overlay">
                <span className="lock-icon">🔒</span>
                <span className="lock-text">
                  Requires 50% Critical Chance to Unlock
                </span>
              </div>
              <div className="upgrade-top blurred-content">
                <div className="upgrade-icon icon-supercrit">🔮</div>
                <div>
                  <div className="upgrade-name">{upg.name}</div>
                  <div className="upgrade-level">
                    Level {upg.level} ({(upg.level * 0.1).toFixed(1)}%)
                  </div>
                </div>
              </div>
              <div className="upgrade-desc blurred-content">
                {UPGRADE_DESCS[i]}
              </div>
              <div className="upgrade-bottom blurred-content">
                <div className="upgrade-cost">
                  <span className="cost-icon">◆</span>
                  <span>{formatNumber(upg.cost)}</span>
                </div>
                <button className="buy-btn" disabled>
                  Locked
                </button>
              </div>
            </div>
          );
        }

        return (
          <div
            key={i}
            className={`upgrade-card${canAfford ? "" : " cant-afford"}`}
            onClick={() => buyUpgrade(i)}
          >
            <div className="upgrade-top">
              <div className={`upgrade-icon ${UPGRADE_ICON_TYPES[i]}`}>
                {UPGRADE_ICONS[i]}
              </div>
              <div>
                <div className="upgrade-name">{upg.name}</div>
                <div className="upgrade-level">
                  {upg.type === "crit"
                    ? `Level ${upg.level} (${Math.min(upg.level, 100)}%)`
                    : upg.type === "super_crit"
                      ? `Level ${upg.level} (${(upg.level * 0.1).toFixed(1)}%)`
                      : upg.type === "heal"
                        ? "Heal 1 HP"
                        : `Level ${upg.level}`}
                </div>
              </div>
            </div>
            <div className="upgrade-desc">{UPGRADE_DESCS[i]}</div>
            <div className="upgrade-bottom">
              <div className="upgrade-cost">
                <span className="cost-icon">◆</span>
                <span>{formatNumber(upg.cost)}</span>
              </div>
              <button className="buy-btn">Buy</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

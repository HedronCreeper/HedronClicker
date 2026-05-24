import React, { useState } from 'react';
import { THEMES, THEME_VARS } from '../constants';
import { applyCSSVars } from '../utils/helpers';
import { encodeGameState, decodeGameState } from '../utils/crypto';
import { parseModZip } from '../utils/mods';
import './SettingsModal.css';

export default function SettingsModal({ gs, setGS, showToast, importState, onClose, onDeleteRequest }) {
  const [fpsBoost, setFpsLocal] = useState(gs.settings.fpsBoost);
  const [theme, setThemeLocal]  = useState(gs.settings.theme);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importingMod, setImportingMod] = useState(false);

  function applyTheme(t) {
    const vars = THEME_VARS[t] || THEME_VARS.default;
    applyCSSVars(vars);
    setThemeLocal(t);
    setGS(prev => ({ ...prev, settings: { ...prev.settings, theme: t } }));
  }

  function applyFPS(val) {
    setFpsLocal(val);
    setGS(prev => ({ ...prev, settings: { ...prev.settings, fpsBoost: val } }));
    document.body.classList.toggle('fps-boost', val === 'on');
  }

  function saveGame() {
    // The autosave hook handles the actual write; this is just a manual trigger
    showToast('💾 Game saved!', 'success');
  }

  async function exportGame() {
    if (exporting) return;
    setExporting(true);
    try {
      const encoded = await encodeGameState(gs);
      const blob = new Blob([encoded], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'HedronClicker_save.hcs';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📤 Progress exported securely!', 'success');
    } catch (e) {
      console.error(e);
      showToast('❌ Export failed', 'error');
    } finally {
      setExporting(false);
    }
  }

  function triggerImport() {
    if (importing) return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.hcs,.txt';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImporting(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = await decodeGameState(ev.target.result.trim());
          if (typeof parsed.points !== 'number' || !Array.isArray(parsed.upgrades))
            throw new Error('Invalid save structure');
          await importState(parsed);
          showToast('📥 Progress imported! Reloading...', 'success');
          window.location.reload();
        } catch (err) {
          console.error(err);
          showToast('❌ Invalid or corrupted save file', 'error');
        } finally {
          setImporting(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function triggerModImport() {
    if (importingMod) return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.zip,application/zip';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImportingMod(true);
      try {
        const mod = await parseModZip(file);
        document.documentElement.style.setProperty('--mod-key-color', mod.keyColor);
        setGS(prev => ({ ...prev, mods: mod }));
        showToast(`🧩 Mod imported: ${mod.name}`, 'success');
      } catch (err) {
        console.error(err);
        showToast(`❌ ${err.message || 'Invalid mod zip'}`, 'error');
      } finally {
        setImportingMod(false);
      }
    };
    input.click();
  }

  function clearMod() {
    document.documentElement.style.setProperty('--mod-key-color', '#ffd700');
    setGS(prev => ({
      ...prev,
      mods: { active: false, clickerImage: null, keyColor: '#ffd700', name: null, importedAt: null },
    }));
    showToast('🧩 Mod removed', 'success');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-title">Settings</div>

        <div className="settings-section">
          <div className="settings-section-title">Theme</div>
          <div className="theme-options">
            {THEMES.map(t => (
              <div
                key={t.id}
                className={`theme-option${theme === t.id ? ' active' : ''}`}
                onClick={() => applyTheme(t.id)}
              >
                <div className="theme-preview">
                  {t.dots.map((d, i) => <div key={i} className="theme-dot" style={{ background: d }} />)}
                </div>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Performance</div>
          <div className="theme-options">
            {['off', 'on'].map(val => (
              <div
                key={val}
                className={`theme-option${fpsBoost === val ? ' active' : ''}`}
                onClick={() => applyFPS(val)}
              >
                FPS Boost: {val === 'off' ? 'Off' : 'On'}
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Mods</div>
          <div className="mod-status">
            {gs.mods?.active ? `Active: ${gs.mods.name || 'Custom Mod'}` : 'No mod active'}
          </div>
          <div className="settings-btn-row">
            <button
              className="settings-action-btn mod-btn"
              onClick={triggerModImport}
              disabled={importingMod}
            >
              {importingMod ? '⏳ Reading Mod...' : '🧩 Import Mod ZIP'}
            </button>
            {gs.mods?.active && (
              <button className="settings-action-btn danger-btn" onClick={clearMod}>
                Remove Mod
              </button>
            )}
          </div>
          <div className="save-security-note">
            Mod ZIPs must contain one folder with clicker_image.png and config.txt.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Data</div>
          <div className="settings-btn-row">
            <button className="settings-action-btn save-btn" onClick={saveGame}>
              💾 Save Game
            </button>
            <button
              className="settings-action-btn export-btn"
              onClick={exportGame}
              disabled={exporting}
            >
              {exporting ? '⏳ Encrypting...' : '📤 Export Progress'}
            </button>
            <button
              className="settings-action-btn import-btn"
              onClick={triggerImport}
              disabled={importing}
            >
              {importing ? '⏳ Decrypting...' : '📥 Import Progress'}
            </button>
            <button className="settings-action-btn danger-btn" onClick={onDeleteRequest}>
              🗑 Delete Progress
            </button>
          </div>
          <div className="save-security-note">
            🔐 Save files are AES-256 encrypted. Only this game can read them.
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import TicTacToe from './TicTacToe.jsx';
import './MinigamesModal.css';

const MINIGAMES_UNLOCK_COST = 10;  // gems
const GAMES = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: '⬜',
    desc: 'Challenge the bot in a classic 3×3 grid. Wins build your streak.',
    gemCost: 1,
  },
];

export default function MinigamesModal({ gs, setGS, showToast, onClose }) {
  const [activeGame, setActiveGame] = useState(null);

  const sectionUnlocked = gs.minigamesUnlocked;
  const gems = gs.gems || 0;

  function unlockSection() {
    if (gems < MINIGAMES_UNLOCK_COST) {
      showToast(`❌ Need ${MINIGAMES_UNLOCK_COST} 💎 gems to unlock!`, 'error');
      return;
    }
    setGS(prev => ({
      ...prev,
      gems: prev.gems - MINIGAMES_UNLOCK_COST,
      minigamesUnlocked: true,
    }));
    showToast('🎮 Minigames section unlocked!', 'success');
  }

  function unlockGame(game) {
    if (gems < game.gemCost) {
      showToast(`❌ Need ${game.gemCost} 💎 gem to unlock ${game.name}!`, 'error');
      return;
    }
    setGS(prev => ({
      ...prev,
      gems: prev.gems - game.gemCost,
      unlockedGames: [...(prev.unlockedGames || []), game.id],
    }));
    showToast(`🎮 ${game.name} unlocked!`, 'success');
  }

  return (
    <div className="mg-backdrop">
      <div className="mg-modal">
        {/* Header */}
        <div className="mg-header">
          <div className="mg-title">
            <span className="mg-title-icon">🎮</span> Minigames
          </div>
          <div className="mg-gem-count">
            💎 {gems} gem{gems !== 1 ? 's' : ''}
          </div>
          <button className="mg-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="mg-body">
          {/* === Section locked === */}
          {!sectionUnlocked && (
            <div className="mg-locked-section">
              <div className="mg-lock-icon">🔒</div>
              <div className="mg-lock-title">Minigames Locked</div>
              <div className="mg-lock-desc">
                Unlock the Minigames section to access fun mini-challenges!
              </div>
              <div className="mg-lock-cost">
                Cost: <span>{MINIGAMES_UNLOCK_COST} 💎 gems</span>
              </div>
              <div className="mg-lock-gem-hint">
                You have <strong>{gems}</strong> 💎. Earn gems by converting points (10K pts = 1 💎) in the shop.
              </div>
              <button
                className={`mg-unlock-btn${gems < MINIGAMES_UNLOCK_COST ? ' disabled' : ''}`}
                onClick={unlockSection}
              >
                Unlock for {MINIGAMES_UNLOCK_COST} 💎
              </button>
            </div>
          )}

          {/* === Section unlocked, no active game === */}
          {sectionUnlocked && !activeGame && (
            <>
              <div className="mg-intro">
                Choose a minigame to play.
              </div>
              <div className="mg-game-grid">
                {GAMES.map(game => {
                  const owned = (gs.unlockedGames || []).includes(game.id);
                  return (
                    <div key={game.id} className={`mg-game-card${owned ? ' unlocked' : ''}`}>
                      <div className="mg-game-icon">{game.icon}</div>
                      <div className="mg-game-name">{game.name}</div>
                      <div className="mg-game-desc">{game.desc}</div>
                      {owned ? (
                        <button
                          className="mg-play-btn"
                          onClick={() => setActiveGame(game.id)}
                        >
                          ▶ Play
                        </button>
                      ) : (
                        <button
                          className={`mg-unlock-game-btn${gems < game.gemCost ? ' disabled' : ''}`}
                          onClick={() => unlockGame(game)}
                        >
                          Unlock — {game.gemCost} 💎
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* === Active game === */}
          {sectionUnlocked && activeGame && (
            <div className="mg-active-game">
              <button className="mg-back-btn" onClick={() => setActiveGame(null)}>
                ← Back to Games
              </button>
              {activeGame === 'tictactoe' && (
                <TicTacToe showToast={showToast} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

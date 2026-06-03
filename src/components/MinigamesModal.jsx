import React, { useState } from 'react';
import TicTacToe from './TicTacToe.jsx';
import './MinigamesModal.css';

const GAMES = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: '⬜',
    desc: 'Challenge the bot in a classic 3×3 grid. Wins build your streak.',
  },
];

export default function MinigamesModal({ gs, setGS, showToast, onClose }) {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="mg-backdrop">
      <div className="mg-modal">
        {/* Header */}
        <div className="mg-header">
          <div className="mg-title">
            <span className="mg-title-icon">🎮</span> Minigames
          </div>
          <button className="mg-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="mg-body">
          {/* === No active game === */}
          {!activeGame && (
            <>
              <div className="mg-intro">
                Choose a minigame to play.
              </div>
              <div className="mg-game-grid">
                {GAMES.map(game => (
                  <div key={game.id} className="mg-game-card unlocked">
                      <div className="mg-game-icon">{game.icon}</div>
                      <div className="mg-game-name">{game.name}</div>
                      <div className="mg-game-desc">{game.desc}</div>
                    <button
                      className="mg-play-btn"
                      onClick={() => setActiveGame(game.id)}
                    >
                      ▶ Play
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* === Active game === */}
          {activeGame && (
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

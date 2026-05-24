import React, { useState, useCallback } from 'react';
import './TicTacToe.css';

// ── Win detection ─────────────────────────────────────────────────────────────
const LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diags
];

function checkWinner(board) {
  for (const [a,b,c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

// ── Bot AI ────────────────────────────────────────────────────────────────────
function minimax(board, isMax, depth) {
  const res = checkWinner(board);
  if (res) {
    if (res.winner === 'O') return  10 - depth;
    if (res.winner === 'X') return -10 + depth;
    return 0;
  }
  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = isMax ? 'O' : 'X';
      scores.push(minimax(board, !isMax, depth + 1));
      board[i] = null;
    }
  }
  return isMax ? Math.max(...scores) : Math.min(...scores);
}

function getBotMove(board, difficulty) {
  const empty = board.map((v,i) => v ? null : i).filter(i => i !== null);
  if (!empty.length) return -1;

  // difficulty: 'easy' = bot plays optimal only 50% of the time
  //             'hard' = bot plays optimal 90% of the time
  const optimalChance = difficulty === 'hard' ? 0.9 : 0.5;

  if (Math.random() > optimalChance) {
    // random move
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Optimal move via minimax
  let bestScore = -Infinity;
  let bestMove  = empty[0];
  for (const i of empty) {
    board[i] = 'O';
    const score = minimax(board, false, 0);
    board[i] = null;
    if (score > bestScore) { bestScore = score; bestMove = i; }
  }
  return bestMove;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TicTacToe({ showToast }) {
  const [phase, setPhase]       = useState('config'); // config | playing | over
  const [difficulty, setDiff]   = useState('easy');
  const [board, setBoard]       = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext]   = useState(true);
  const [result, setResult]     = useState(null); // { winner, line }
  const [botThinking, setBotThinking] = useState(false);
  const [winStreak, setWinStreak] = useState(0);

  function startGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setResult(null);
    setBotThinking(false);
    setPhase('playing');
  }

  const handleCellClick = useCallback((idx) => {
    if (!xIsNext || board[idx] || result || botThinking) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    const res = checkWinner(newBoard);

    if (res) {
      setBoard(newBoard);
      setResult(res);
      setPhase('over');
      if (res.winner === 'X') {
        const streak = winStreak + 1;
        setWinStreak(streak);
        showToast('🏆 You won!', 'success');
      } else if (res.winner === 'draw') {
        showToast("🤝 It's a draw!", '');
        setWinStreak(0);
      } else {
        showToast('😔 Bot wins this round!', 'error');
        setWinStreak(0);
      }
      return;
    }

    setBoard(newBoard);
    setXIsNext(false);
    setBotThinking(true);

    // Bot moves after short delay for UX
    setTimeout(() => {
      const botBoard = [...newBoard];
      const move = getBotMove(botBoard, difficulty);
      if (move !== -1) botBoard[move] = 'O';
      const botRes = checkWinner(botBoard);
      setBoard(botBoard);
      setBotThinking(false);
      if (botRes) {
        setResult(botRes);
        setPhase('over');
        if (botRes.winner === 'O') {
          showToast('😔 Bot wins this round!', 'error');
          setWinStreak(0);
        } else {
          showToast("🤝 It's a draw!", '');
          setWinStreak(0);
        }
      } else {
        setXIsNext(true);
      }
    }, 400 + Math.random() * 300);
  }, [xIsNext, board, result, botThinking, difficulty, winStreak, showToast]);

  const SYMBOLS = { X: '✕', O: '◯' };

  // ── Config screen ──
  if (phase === 'config') {
    return (
      <div className="ttt-wrapper">
        <div className="ttt-title">Tic Tac Toe</div>
        <div className="ttt-subtitle">You are <span className="ttt-x">✕</span>, bot is <span className="ttt-o">◯</span></div>
        <div className="ttt-config">
          <div className="ttt-config-label">Select Difficulty</div>
          <div className="ttt-diff-row">
            {['easy','hard'].map(d => (
              <button
                key={d}
                className={`ttt-diff-btn${difficulty === d ? ' active' : ''}`}
                onClick={() => setDiff(d)}
              >
                {d === 'easy' ? '😊 Easy' : '😈 Hard'}
              </button>
            ))}
          </div>
          <div className="ttt-diff-desc">
            {difficulty === 'easy'
              ? 'Bot plays randomly 50% of the time. Good for learning!'
              : 'Bot plays near-perfectly 90% of the time. A real challenge!'}
          </div>
          <div className="ttt-gem-info">Play for the win streak.</div>
          {winStreak > 0 && (
            <div className="ttt-streak">🔥 Current streak: {winStreak}</div>
          )}
          <button className="ttt-start-btn" onClick={startGame}>Play!</button>
        </div>
      </div>
    );
  }

  // ── Board ──
  const isWinCell = result?.line?.includes;

  return (
    <div className="ttt-wrapper">
      <div className="ttt-title">Tic Tac Toe</div>
      <div className="ttt-meta-row">
        <span className={`ttt-turn${xIsNext ? ' x' : ' o'}`}>
          {result
            ? result.winner === 'draw'
              ? "🤝 Draw!"
              : `${result.winner === 'X' ? '✕' : '◯'} Wins!`
            : botThinking
              ? '🤔 Bot is thinking...'
              : `Your turn (✕)`}
        </span>
        <span className="ttt-streak-badge">🔥 {winStreak}</span>
      </div>

      <div className="ttt-board">
        {board.map((cell, i) => {
          const isWin = result?.line?.includes(i);
          return (
            <button
              key={i}
              className={`ttt-cell${cell ? ' filled' : ''}${cell === 'X' ? ' cx' : cell === 'O' ? ' co' : ''}${isWin ? ' win-cell' : ''}${!cell && !result && xIsNext && !botThinking ? ' hoverable' : ''}`}
              onClick={() => handleCellClick(i)}
              disabled={!!cell || !!result || !xIsNext || botThinking}
            >
              {cell ? SYMBOLS[cell] : ''}
            </button>
          );
        })}
      </div>

      {phase === 'over' && (
        <div className="ttt-over-row">
          <button className="ttt-again-btn" onClick={startGame}>Play Again</button>
          <button className="ttt-config-btn" onClick={() => setPhase('config')}>Change Mode</button>
        </div>
      )}
      {phase === 'playing' && (
        <button className="ttt-config-btn" onClick={() => { setPhase('config'); setResult(null); }}>
          ← Back
        </button>
      )}
    </div>
  );
}

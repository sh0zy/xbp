// Board state: 0=empty, 1=black, 2=white
let board = [];
let currentPlayer = 1; // 1=black, 2=white
let gameOver = false;

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const BOARD_SIZE = 8;

// Directions: 8-direction (up, down, left, right, and diagonals)
const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

function initBoard() {
  board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  // Initial setup: 4 stones in the center 2x2 square
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  currentPlayer = BLACK;
  gameOver = false;
  updateBoard();
  updateStatus();
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      if (board[r][c] !== EMPTY) {
        const stone = document.createElement('div');
        stone.className = 'stone' + (board[r][c] === BLACK ? ' black' : '');
        cell.appendChild(stone);
      }
      
      cell.addEventListener('click', () => handleCellClick(r, c));
      boardEl.appendChild(cell);
    }
  }
}

function getOpponentPlayer(player) {
  return player === BLACK ? WHITE : BLACK;
}

function isValidMove(row, col, player) {
  if (board[row][col] !== EMPTY) return false;
  
  // Check all 8 directions
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let hasOpponent = false;
    
    // Scan in direction while finding opponent stones
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === getOpponentPlayer(player)) {
      hasOpponent = true;
      r += dr;
      c += dc;
    }
    
    // Valid if we found opponent stones and ended with our stone
    if (hasOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      return true;
    }
  }
  
  return false;
}

function getValidMoves(player) {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isValidMove(r, c, player)) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

function flipStones(row, col, player) {
  // Flip all opponent stones in valid directions
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    const toFlip = [];
    
    // Collect opponent stones in this direction
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === getOpponentPlayer(player)) {
      toFlip.push([r, c]);
      r += dr;
      c += dc;
    }
    
    // Flip if we found our stone at the end
    if (toFlip.length > 0 && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      for (const [fr, fc] of toFlip) {
        board[fr][fc] = player;
      }
    }
  }
}

function handleCellClick(row, col) {
  if (gameOver || !isValidMove(row, col, currentPlayer)) {
    return;
  }
  
  // Place stone
  board[row][col] = currentPlayer;
  flipStones(row, col, currentPlayer);
  
  // Switch player
  currentPlayer = getOpponentPlayer(currentPlayer);
  
  // Check if next player has valid moves
  if (getValidMoves(currentPlayer).length === 0) {
    // Try opponent
    currentPlayer = getOpponentPlayer(currentPlayer);
    if (getValidMoves(currentPlayer).length === 0) {
      // Both players can't move -> game over
      gameOver = true;
      updateStatus();
      renderBoard();
      return;
    }
  }
  
  updateBoard();
}

function handlePass() {
  if (gameOver) return;
  
  // Check if current player has valid moves
  if (getValidMoves(currentPlayer).length > 0) {
    alert('有効な手があります。パスできません。');
    return;
  }
  
  // Switch player
  currentPlayer = getOpponentPlayer(currentPlayer);
  
  // Check if opponent has valid moves
  if (getValidMoves(currentPlayer).length === 0) {
    // Both can't move
    gameOver = true;
    updateStatus();
    return;
  }
  
  updateStatus();
}

function handleReset() {
  initBoard();
}

function updateBoard() {
  renderBoard();
  updateStatus();
}

function updateStatus() {
  const [blackCount, whiteCount] = getScore();
  document.getElementById('black-score').textContent = blackCount;
  document.getElementById('white-score').textContent = whiteCount;
  
  const statusEl = document.querySelector('.status');
  if (gameOver) {
    const winner = blackCount > whiteCount ? '黒の勝ち！' : whiteCount > blackCount ? '白の勝ち！' : '同点！';
    statusEl.textContent = `ゲーム終了 ${winner}`;
  } else {
    const playerColor = currentPlayer === BLACK ? '黒' : '白';
    statusEl.textContent = `${playerColor}のターン`;
  }
  
  const turnEl = document.querySelector('.turn');
  if (!gameOver) {
    const playerColor = currentPlayer === BLACK ? '黒' : '白';
    turnEl.textContent = `順番: ${playerColor}`;
  }
}

function getScore() {
  let blackCount = 0, whiteCount = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === BLACK) blackCount++;
      else if (board[r][c] === WHITE) whiteCount++;
    }
  }
  return [blackCount, whiteCount];
}

// Event listeners
document.getElementById('pass-btn').addEventListener('click', handlePass);
document.getElementById('reset-btn').addEventListener('click', handleReset);

// Initialize game on load
window.addEventListener('DOMContentLoaded', initBoard);

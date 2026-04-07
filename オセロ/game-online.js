// ゲーム定数
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const BOARD_SIZE = 8;

// Socket.IO接続
const socket = io();

// ゲーム状態
let gameState = {
  roomId: null,
  playerColor: null,
  board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)),
  currentPlayer: BLACK,
  gameOver: false,
  blackCount: 2,
  whiteCount: 2,
  validMoves: []
};

// UI要素
const matchScreen = document.getElementById('matchscreen');
const gameScreen = document.getElementById('gamescreen');
const searchBtn = document.getElementById('search-btn');
const localBtn = document.getElementById('local-btn');
const menuBtn = document.getElementById('menu-btn');
const passBtn = document.getElementById('pass-btn');
const resetBtn = document.getElementById('reset-btn');
const matchStatus = document.getElementById('match-status');
const playerInfo = document.getElementById('player-info');

// イベントリスナー
searchBtn.addEventListener('click', () => {
  searchBtn.disabled = true;
  matchStatus.textContent = '相手を探し中...';
  socket.emit('search-match');
});

localBtn.addEventListener('click', () => {
  window.location.href = '../オセロ/game.html'; // ローカルモードがあれば
});

menuBtn.addEventListener('click', () => {
  resetGame();
  gameScreen.classList.add('hidden');
  matchScreen.classList.remove('hidden');
  searchBtn.disabled = false;
  searchBtn.textContent = '相手を探す';
  matchStatus.textContent = '';
});

passBtn.addEventListener('click', () => {
  if (gameState.playerColor === gameState.currentPlayer) {
    socket.emit('pass', { roomId: gameState.roomId });
  }
});

resetBtn.addEventListener('click', () => {
  // リセット機能（両者が同意した場合）
  window.location.reload();
});

// Socket.IOイベント
socket.on('waiting', (message) => {
  matchStatus.textContent = message;
});

socket.on('match-found', (data) => {
  gameState.roomId = data.roomId;
  gameState.playerColor = data.playerColor;
  updateGameState(data.gameState);

  // マッチング画面をゲーム画面に切り替え
  matchScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // プレイヤー情報の表示
  const colorName = gameState.playerColor === BLACK ? '黒' : '白';
  playerInfo.textContent = `あなたは${colorName}です`;

  renderBoard();
});

socket.on('board-updated', (data) => {
  updateGameState(data);
  renderBoard();
});

socket.on('game-over', (data) => {
  const { result, score } = data;
  let resultText = '';
  if (result === 'BLACK_WIN') resultText = '黒の勝利！';
  else if (result === 'WHITE_WIN') resultText = '白の勝利！';
  else resultText = '引き分け';

  const message = `
    ${resultText}
    黒: ${score.black} | 白: ${score.white}
  `;

  document.querySelector('.status').textContent = message;
  gameState.gameOver = true;
});

socket.on('error', (message) => {
  alert(`エラー: ${message}`);
});

socket.on('opponent-disconnected', (message) => {
  alert(message);
  resetGame();
  gameScreen.classList.add('hidden');
  matchScreen.classList.remove('hidden');
  searchBtn.disabled = false;
});

// ゲーム状態の更新
function updateGameState(state) {
  gameState.board = state.board;
  gameState.currentPlayer = state.currentPlayer;
  gameState.gameOver = state.gameOver;
  gameState.blackCount = state.blackCount;
  gameState.whiteCount = state.whiteCount;
  gameState.validMoves = state.validMoves;

  updateStatus();
}

// ステータス表示の更新
function updateStatus() {
  document.getElementById('black-score').textContent = gameState.blackCount;
  document.getElementById('white-score').textContent = gameState.whiteCount;

  if (!gameState.gameOver) {
    const currentColorName = gameState.currentPlayer === BLACK ? '黒' : '白';
    document.getElementById('turn').textContent = `順番: ${currentColorName}`;
  }

  const statusEl = document.querySelector('.status');
  if (gameState.playerColor === gameState.currentPlayer) {
    statusEl.textContent = 'あなたのターン';
  } else {
    const opponentColorName = gameState.currentPlayer === BLACK ? '黒' : '白';
    statusEl.textContent = `${opponentColorName}の順番`;
  }
}

// ボード描画
function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      // 石を描画
      if (gameState.board[r][c] !== EMPTY) {
        const stone = document.createElement('div');
        stone.className = gameState.board[r][c] === BLACK ? 'stone black' : 'stone';
        cell.appendChild(stone);
      }

      // 有効な手を示す
      if (gameState.validMoves.some(move => move[0] === r && move[1] === c) &&
          gameState.playerColor === gameState.currentPlayer) {
        cell.classList.add('valid-move');
      }

      cell.addEventListener('click', () => {
        if (!gameState.gameOver && gameState.playerColor === gameState.currentPlayer) {
          handleCellClick(r, c);
        }
      });

      boardEl.appendChild(cell);
    }
  }
}

// セルクリック処理
function handleCellClick(row, col) {
  if (gameState.validMoves.some(move => move[0] === row && move[1] === col)) {
    socket.emit('make-move', {
      roomId: gameState.roomId,
      row: row,
      col: col
    });
  } else {
    alert('そこには置けません');
  }
}

// ゲームリセット
function resetGame() {
  gameState.roomId = null;
  gameState.playerColor = null;
  gameState.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  gameState.currentPlayer = BLACK;
  gameState.gameOver = false;
  gameState.blackCount = 2;
  gameState.whiteCount = 2;
  gameState.validMoves = [];

  matchStatus.textContent = '';
  playerInfo.textContent = '';
  document.querySelector('.status').textContent = '';
}

// 初期化
window.addEventListener('load', () => {
  matchScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
});

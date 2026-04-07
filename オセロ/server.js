import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static(__dirname));

const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

// ゲームルーム管理
const gameRooms = new Map();
let waitingPlayer = null;

class OthelloGame {
  constructor() {
    this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
    this.board[3][3] = WHITE;
    this.board[3][4] = BLACK;
    this.board[4][3] = BLACK;
    this.board[4][4] = WHITE;
    this.currentPlayer = BLACK;
    this.gameOver = false;
    this.players = { [BLACK]: null, [WHITE]: null };
    this.passCount = 0;
  }

  getValidMoves(player) {
    const moves = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.isValidMove(r, c, player)) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  }

  isValidMove(row, col, player) {
    if (this.board[row][col] !== EMPTY) return false;
    
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let hasOpponent = false;
      
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && 
             this.board[r][c] === (player === BLACK ? WHITE : BLACK)) {
        hasOpponent = true;
        r += dr;
        c += dc;
      }
      
      if (hasOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && 
          this.board[r][c] === player) {
        return true;
      }
    }
    
    return false;
  }

  flipStones(row, col, player) {
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      const toFlip = [];
      
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && 
             this.board[r][c] === (player === BLACK ? WHITE : BLACK)) {
        toFlip.push([r, c]);
        r += dr;
        c += dc;
      }
      
      if (toFlip.length > 0 && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && 
          this.board[r][c] === player) {
        for (const [fr, fc] of toFlip) {
          this.board[fr][fc] = player;
        }
      }
    }
  }

  makeMove(row, col, player) {
    if (!this.isValidMove(row, col, player)) {
      return false;
    }
    
    this.board[row][col] = player;
    this.flipStones(row, col, player);
    this.passCount = 0;
    
    this.currentPlayer = player === BLACK ? WHITE : BLACK;
    
    if (this.getValidMoves(this.currentPlayer).length === 0) {
      this.currentPlayer = player === BLACK ? BLACK : WHITE;
      if (this.getValidMoves(this.currentPlayer).length === 0) {
        this.gameOver = true;
      }
    }
    
    return true;
  }

  pass() {
    if (this.getValidMoves(this.currentPlayer).length > 0) {
      return false;
    }
    
    this.passCount++;
    this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
    
    if (this.passCount >= 2 || this.getValidMoves(this.currentPlayer).length === 0) {
      this.gameOver = true;
    }
    
    return true;
  }

  getScore() {
    let blackCount = 0, whiteCount = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.board[r][c] === BLACK) blackCount++;
        else if (this.board[r][c] === WHITE) whiteCount++;
      }
    }
    return { black: blackCount, white: whiteCount };
  }

  getState() {
    const score = this.getScore();
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      blackCount: score.black,
      whiteCount: score.white,
      validMoves: this.getValidMoves(this.currentPlayer)
    };
  }
}

io.on('connection', (socket) => {
  console.log('ユーザー接続:', socket.id);

  socket.on('search-match', () => {
    if (waitingPlayer) {
      // マッチング成功
      const roomId = `room_${Date.now()}`;
      const game = new OthelloGame();
      game.players[BLACK] = waitingPlayer;
      game.players[WHITE] = socket.id;

      gameRooms.set(roomId, {
        game,
        blackSocketId: waitingPlayer,
        whiteSocketId: socket.id
      });

      io.to(waitingPlayer).emit('match-found', { 
        roomId, 
        playerColor: BLACK,
        gameState: game.getState()
      });
      socket.emit('match-found', { 
        roomId, 
        playerColor: WHITE,
        gameState: game.getState()
      });

      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer).join(roomId);

      waitingPlayer = null;
    } else {
      // 待機中
      waitingPlayer = socket.id;
      socket.emit('waiting', '相手プレイヤーを待機中...');
    }
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('make-move', ({ roomId, row, col }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;

    const { game, blackSocketId, whiteSocketId } = room;
    const playerColor = socket.id === blackSocketId ? BLACK : WHITE;

    if (game.currentPlayer !== playerColor) {
      socket.emit('error', 'あなたのターンではありません');
      return;
    }

    if (game.makeMove(row, col, playerColor)) {
      const state = game.getState();
      io.to(roomId).emit('board-updated', state);

      if (game.gameOver) {
        const score = game.getScore();
        const result = score.black > score.white ? 'BLACK_WIN' : 
                      score.white > score.black ? 'WHITE_WIN' : 'DRAW';
        io.to(roomId).emit('game-over', { result, score });
      }
    }
  });

  socket.on('pass', ({ roomId }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;

    const { game, blackSocketId, whiteSocketId } = room;
    const playerColor = socket.id === blackSocketId ? BLACK : WHITE;

    if (game.currentPlayer !== playerColor) {
      socket.emit('error', 'あなたのターンではありません');
      return;
    }

    if (game.pass()) {
      const state = game.getState();
      io.to(roomId).emit('board-updated', state);

      if (game.gameOver) {
        const score = game.getScore();
        const result = score.black > score.white ? 'BLACK_WIN' : 
                      score.white > score.black ? 'WHITE_WIN' : 'DRAW';
        io.to(roomId).emit('game-over', { result, score });
      }
    } else {
      socket.emit('error', '有効な手があります。パスできません。');
    }
  });

  socket.on('disconnect', () => {
    console.log('ユーザー切断:', socket.id);
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
    }

    // ゲームルームのクリーンアップ
    for (const [roomId, room] of gameRooms.entries()) {
      if (room.blackSocketId === socket.id || room.whiteSocketId === socket.id) {
        io.to(roomId).emit('opponent-disconnected', 'ゲーム相手が切断しました');
        gameRooms.delete(roomId);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`オセロサーバー ${PORT} ポートで起動`);
  console.log(`http://localhost:${PORT}`);
});

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===============================
//  グローバル状態
// ===============================
let gameState = "idle"; // idle, playing
let playerScore = 0;
let enemyScore = 0;
let difficulty = 1;

// パーティクル管理
const particles = [];

// ===============================
//  パーティクルクラス
// ===============================
class Particle {
  constructor(x, y, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.lifetime = 30;
    this.maxLifetime = 30;
    this.size = 5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // 重力
    this.lifetime--;
  }

  draw() {
    const alpha = this.lifetime / this.maxLifetime;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  isAlive() {
    return this.lifetime > 0;
  }
}

function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 3 + 1;
    particles.push(
      new Particle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed)
    );
  }
}

// ===============================
//  Pin クラス（回転＋摩擦＋スリップ＋初期位置）
// ===============================
class Pin {
  constructor(x, y, color, mass = 1) {
    this.initX = x;
    this.initY = y;

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 25;
    this.color = color;
    this.mass = mass;

    this.angle = 0;
    this.av = 0;
    this.inertia = mass * (this.size * this.size) / 6;
  }

  reset() {
    this.x = this.initX;
    this.y = this.initY;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.av = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 摩擦
    const friction = 0.98;
    this.vx *= friction;
    this.vy *= friction;

    // 回転スリップ
    const slipStrength = 0.05;
    this.vx += this.av * slipStrength;
    this.vy -= this.av * slipStrength;

    // 回転減衰
    this.av *= 0.95;
    this.angle += this.av;

    // 停止処理
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;
    if (Math.abs(this.av) < 0.001) this.av = 0;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // グラデーション効果
    const gradient = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.shadeColor(this.color, -30));

    ctx.fillStyle = gradient;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);

    // 枠線
    ctx.strokeStyle = this.shadeColor(this.color, -50);
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);

    ctx.restore();
  }

  shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(Math.max(R, 0));
    G = Math.round(Math.max(G, 0));
    B = Math.round(Math.max(B, 0));

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  isOut() {
    return (
      this.x < -this.size || this.x > canvas.width + this.size ||
      this.y < -this.size || this.y > canvas.height + this.size
    );
  }
}

// ===============================
//  プレイヤー & CPU
// ===============================
const player = new Pin(150, canvas.height / 2, "#3B82F6", 1);
const enemy = new Pin(canvas.width - 150, canvas.height / 2, "#EF4444", 1.2);

// ===============================
//  入力（ドラッグショット）
// ===============================
let dragging = false;
let startX = 0;
let startY = 0;
let dragTrail = [];

canvas.addEventListener("mousedown", e => {
  if (gameState !== "playing" || Math.abs(player.vx) > 0.5 || Math.abs(player.vy) > 0.5) return;

  dragging = true;
  startX = e.offsetX;
  startY = e.offsetY;
  dragTrail = [];

  updateStatus("ドラッグして発射...");
});

canvas.addEventListener("mousemove", e => {
  if (!dragging) return;
  dragTrail.push({ x: e.offsetX, y: e.offsetY });
  if (dragTrail.length > 20) dragTrail.shift();
});

canvas.addEventListener("mouseup", e => {
  if (!dragging) return;
  dragging = false;
  dragTrail = [];

  const dx = startX - e.offsetX;
  const dy = startY - e.offsetY;
  const power = Math.hypot(dx, dy) / 100;

  if (power > 0.5) {
    player.vx = dx * 0.15;
    player.vy = dy * 0.15;
    spawnParticles(player.x, player.y, "#3B82F6", 15);

    setTimeout(cpuShoot, 800);
    updateStatus("CPU思考中...");
  }
});

// デバイスの場合
canvas.addEventListener("touchstart", e => {
  if (gameState !== "playing") return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  dragging = true;
  startX = touch.clientX - rect.left;
  startY = touch.clientY - rect.top;
  dragTrail = [];
});

canvas.addEventListener("touchmove", e => {
  if (!dragging) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  dragTrail.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  if (dragTrail.length > 20) dragTrail.shift();
});

canvas.addEventListener("touchend", e => {
  if (!dragging) return;
  dragging = false;
  const touch = e.changedTouches[0];
  const rect = canvas.getBoundingClientRect();
  const endX = touch.clientX - rect.left;
  const endY = touch.clientY - rect.top;

  const dx = startX - endX;
  const dy = startY - endY;
  const power = Math.hypot(dx, dy) / 100;

  if (power > 0.5) {
    player.vx = dx * 0.15;
    player.vy = dy * 0.15;
    spawnParticles(player.x, player.y, "#3B82F6", 15);

    setTimeout(cpuShoot, 800);
    updateStatus("CPU思考中...");
  }
  dragTrail = [];
});

// ===============================
//  CPU のスピンショット
// ===============================
let cpuReady = true;

function cpuShoot() {
  if (!cpuReady || gameState !== "playing") return;

  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.hypot(dx, dy);

  if (dist === 0) return;

  const diffMultiplier = 0.8 + difficulty * 0.3;
  const type = Math.random();

  if (type < 0.5) {
    enemy.vx = dx / dist * 8 * diffMultiplier;
    enemy.vy = dy / dist * 8 * diffMultiplier;
    enemy.av = 0;

  } else if (type < 0.8) {
    enemy.vx = dx / dist * 6 * diffMultiplier;
    enemy.vy = dy / dist * 6 * diffMultiplier;
    enemy.av = (Math.random() < 0.5 ? -1 : 1) * 0.3;

  } else {
    enemy.vx = dx / dist * 12 * diffMultiplier;
    enemy.vy = dy / dist * 12 * diffMultiplier;
    enemy.av = (Math.random() - 0.5) * 0.2;
  }

  spawnParticles(enemy.x, enemy.y, "#EF4444", 15);
  cpuReady = false;
}

// ===============================
//  衝突判定
// ===============================
function checkCollision(a, b) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return dist < (a.size + b.size) / 2;
}

// ===============================
//  衝突処理（回転＋スリップ＋重なり解消）
// ===============================
function resolveCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);

  if (dist === 0) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const tx = -ny;
  const ty = nx;

  const rvx = a.vx - b.vx;
  const rvy = a.vy - b.vy;

  const vn = rvx * nx + rvy * ny;
  if (vn > 0) return;

  const restitution = 0.7;

  const j = -(1 + restitution) * vn / (1/a.mass + 1/b.mass);
  const jx = j * nx;
  const jy = j * ny;

  a.vx += jx / a.mass;
  a.vy += jy / a.mass;
  b.vx -= jx / b.mass;
  b.vy -= jy / b.mass;

  const vt = rvx * tx + rvy * ty;
  const friction = 0.2;

  const jt = -vt * friction / (1/a.mass + 1/b.mass);
  const jtx = jt * tx;
  const jty = jt * ty;

  a.vx += jtx / a.mass;
  a.vy += jty / a.mass;
  b.vx -= jtx / b.mass;
  b.vy -= jty / b.mass;

  a.av += jt / a.inertia * a.size;
  b.av -= jt / b.inertia * b.size;

  // 重なり解消
  const overlap = (a.size + b.size) / 2 - dist;
  if (overlap > 0) {
    const correction = overlap / (a.mass + b.mass);
    a.x -= nx * correction * b.mass;
    a.y -= ny * correction * b.mass;
    b.x += nx * correction * a.mass;
    b.y += ny * correction * a.mass;
  }

  // パーティクル生成
  spawnParticles(a.x + nx * a.size / 2, a.y + ny * a.size / 2, "#FFD700", 8);
}

// ===============================
//  UI 更新
// ===============================
function updateStatus(text) {
  document.getElementById("status").textContent = text;
}

function updateScores() {
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("cpuScore").textContent = enemyScore;
}

function resetGame() {
  playerScore = 0;
  enemyScore = 0;
  updateScores();
  player.reset();
  enemy.reset();
  gameState = "playing";
  cpuReady = true;
  updateStatus("準備完了 - ドラッグして撃ってください");
  particles.length = 0;
}

// ===============================
//  ドローイングサポート関数
// ===============================
function drawDragTrail() {
  if (!dragging || dragTrail.length < 2) return;

  ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  dragTrail.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.stroke();
}

// ===============================
//  メインループ
// ===============================
function loop() {
  ctx.fillStyle = "#f5f7fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 背景グラデーション
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#f5f7fa");
  gradient.addColorStop(1, "#c3cfe2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "playing") {
    player.update();
    enemy.update();

    if (checkCollision(player, enemy)) {
      resolveCollision(player, enemy);
    }

    // 勝敗判定
    if (enemy.isOut()) {
      playerScore++;
      updateScores();
      updateStatus("勝ち！ 🎉");
      player.reset();
      enemy.reset();
      cpuReady = true;
      spawnParticles(canvas.width / 2, canvas.height / 2, "#3B82F6", 50);
      setTimeout(() => cpuReady = true, 1000);
    }

    if (player.isOut()) {
      enemyScore++;
      updateScores();
      updateStatus("CPU勝利...");
      player.reset();
      enemy.reset();
      cpuReady = true;
      spawnParticles(canvas.width / 2, canvas.height / 2, "#EF4444", 50);
      setTimeout(() => cpuReady = true, 1000);
    }

    // ゲーム終了判定
    if (playerScore >= 3) {
      gameState = "idle";
      updateStatus("あなたの勝ち！ 🏆 リセットボタンで再スタート");
    }

    if (enemyScore >= 3) {
      gameState = "idle";
      updateStatus("CPUの勝ち... リセットボタンで再スタート");
    }
  }

  // パーティクル更新・描画
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (!particles[i].isAlive()) {
      particles.splice(i, 1);
    }
  }

  player.draw();
  enemy.draw();

  // ドラッグトレイル描画
  drawDragTrail();

  // 中央線
  ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  requestAnimationFrame(loop);
}

// ===============================
//  UI イベント
// ===============================
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.getElementById("helpBtn").addEventListener("click", () => {
  document.getElementById("helpModal").classList.remove("hidden");
});

document.querySelector(".close").addEventListener("click", closeHelp);

function closeHelp() {
  document.getElementById("helpModal").classList.add("hidden");
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("helpModal");
  if (event.target === modal) {
    closeHelp();
  }
});

// ゲーム開始
resetGame();
loop();

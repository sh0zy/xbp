// ====== タイマー状態 ======
let timerId = null;
let remainingMs = 25 * 60 * 1000;
let totalMs = 25 * 60 * 1000;
let isRunning = false;

// 集中時間データ（localStorage）
const STORAGE_KEY = "focusWaveData_v1";

// DOM 取得
const timerDisplay = document.getElementById("timerDisplay");
const minutesInput = document.getElementById("minutesInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const todayTotalEl = document.getElementById("todayTotal");
const weekTotalEl = document.getElementById("weekTotal");
const monthTotalEl = document.getElementById("monthTotal");
const streakDaysEl = document.getElementById("streakDays");
const titleBadgeEl = document.getElementById("titleBadge");
const weekChartSvg = document.getElementById("weekChart");
const waveSvg = document.querySelector(".wave-bg svg");
const wavePath = document.getElementById("wavePath");

// ====== ユーティリティ ======
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        sessions: [], // {date: "YYYY-MM-DD", minutes: number}
        streak: 0,
        lastFocusDate: null
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      sessions: [],
      streak: 0,
      lastFocusDate: null
    };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatTime(ms) {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getTodayStr() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getWeekStart(date) {
  // 月曜始まり
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0:月 ~ 6:日
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// ====== 集中時間集計 ======
function computeTotals(data) {
  const todayStr = getTodayStr();
  const today = new Date(todayStr);
  const weekStart = getWeekStart(today);
  const monthKey = getMonthKey(today);

  let todayMinutes = 0;
  let weekMinutes = 0;
  let monthMinutes = 0;

  const weeklyArray = new Array(7).fill(0); // 月〜日

  data.sessions.forEach((s) => {
    const d = new Date(s.date);
    const sessionMinutes = s.minutes || 0;

    // 今日
    if (s.date === todayStr) {
      todayMinutes += sessionMinutes;
    }

    // 週
    if (d >= weekStart && d < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      weekMinutes += sessionMinutes;
      const dayIndex = (d.getDay() + 6) % 7;
      weeklyArray[dayIndex] += sessionMinutes;
    }

    // 月
    if (getMonthKey(d) === monthKey) {
      monthMinutes += sessionMinutes;
    }
  });

  return {
    todayMinutes,
    weekMinutes,
    monthMinutes,
    weeklyArray
  };
}

// ====== 称号ロジック ======
function getTitleByStreak(streak) {
  if (streak >= 30) return "称号：深海の賢者";
  if (streak >= 14) return "称号：荒波の制御者";
  if (streak >= 7) return "称号：波に乗る探求者";
  if (streak >= 3) return "称号：揺らめく集中の旅人";
  if (streak >= 1) return "称号：一滴の決意";
  return "称号：初心の波";
}

// ====== UI 更新 ======
function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingMs);
  updateWaveByProgress();
}

function updateSummaryAndChart() {
  const data = loadData();
  const totals = computeTotals(data);

  todayTotalEl.textContent = `${totals.todayMinutes} 分`;
  weekTotalEl.textContent = `${totals.weekMinutes} 分`;
  monthTotalEl.textContent = `${totals.monthMinutes} 分`;
  streakDaysEl.textContent = `${data.streak} 日`;
  titleBadgeEl.textContent = getTitleByStreak(data.streak);

  renderWeekChart(totals.weeklyArray);
}

// 週グラフ SVG 生成
function renderWeekChart(weeklyArray) {
  // 既存の棒を削除
  const oldBars = weekChartSvg.querySelectorAll(".bar, .bar-bg, #barGradient");
  oldBars.forEach((el) => el.remove());

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  grad.setAttribute("id", "barGradient");
  grad.setAttribute("x1", "0");
  grad.setAttribute("y1", "0");
  grad.setAttribute("x2", "0");
  grad.setAttribute("y2", "1");

  const s1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  s1.setAttribute("offset", "0%");
  s1.setAttribute("stop-color", "#4fc3f7");
  const s2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  s2.setAttribute("offset", "100%");
  s2.setAttribute("stop-color", "#1e3a8a");

  grad.appendChild(s1);
  grad.appendChild(s2);
  defs.appendChild(grad);
  weekChartSvg.appendChild(defs);

  const maxMinutes = Math.max(30, ...weeklyArray); // 最低スケール 30分
  const baseY = 90;
  const baseX = 5;
  const chartWidth = 190;
  const barWidth = chartWidth / 7 - 4;

  weeklyArray.forEach((min, i) => {
    const x = baseX + 4 + i * (chartWidth / 7);
    const ratio = min / maxMinutes;
    const height = ratio * 70;

    // 背景バー
    const barBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    barBg.setAttribute("x", x);
    barBg.setAttribute("y", baseY - 70);
    barBg.setAttribute("width", barWidth);
    barBg.setAttribute("height", 70);
    barBg.setAttribute("class", "bar-bg");
    weekChartSvg.appendChild(barBg);

    // 実バー
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x);
    bar.setAttribute("y", baseY - 0); // アニメ開始位置
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", 0);
    bar.setAttribute("class", "bar");

    // 高さをアニメーション
    requestAnimationFrame(() => {
      bar.setAttribute("y", baseY - height);
      bar.setAttribute("height", height);
    });

    weekChartSvg.appendChild(bar);
  });
}

// ====== 波アニメーション（残り時間に応じて上昇） ======
function updateWaveByProgress() {
  if (!totalMs || !waveSvg) return;

  const progress = 1 - remainingMs / totalMs; // 0→1
  const translateY = 20 - progress * 35; // 高いほど上昇
  waveSvg.style.transform = `translate3d(0, ${translateY}%, 0)`;
}

// ====== タイマー制御 ======
function applyNewDurationFromInput() {
  const minutes = parseInt(minutesInput.value, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  const ms = minutes * 60 * 1000;
  totalMs = ms;
  remainingMs = ms;
  updateDisplay();
}

minutesInput.addEventListener("change", () => {
  if (isRunning) return;
  applyNewDurationFromInput();
});

function startTimer() {
  if (isRunning) return;

  // 分を確定
  applyNewDurationFromInput();

  // フルスクリーン強制（試行）
  requestFullscreenSoft();

  const startTime = Date.now();
  const endTime = startTime + remainingMs;
  isRunning = true;

  startBtn.disabled = true;
  minutesInput.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;

  clearInterval(timerId);
  timerId = setInterval(() => {
    const now = Date.now();
    remainingMs = Math.max(0, endTime - now);
    updateDisplay();

    if (remainingMs <= 0) {
      clearInterval(timerId);
      isRunning = false;
      handleFocusCompleted();
      startBtn.disabled = false;
      minutesInput.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
    }
  }, 200);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerId);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  // minutesInput は再設定を防ぐためそのまま disabled
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerId);
  applyNewDurationFromInput();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  minutesInput.disabled = false;
}

// 集中完了時の記録
function handleFocusCompleted() {
  const data = loadData();
  const todayStr = getTodayStr();
  const minutes = totalMs / 1000 / 60;

  // 今日のセッションを加算
  const existing = data.sessions.find((s) => s.date === todayStr);
  if (existing) {
    existing.minutes += minutes;
  } else {
    data.sessions.push({ date: todayStr, minutes });
  }

  // 連続成功日数
  const last = data.lastFocusDate ? new Date(data.lastFocusDate) : null;
  const today = new Date(todayStr);
  let newStreak = data.streak || 0;
  if (!last) {
    newStreak = 1;
  } else {
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }
  data.streak = newStreak;
  data.lastFocusDate = todayStr;

  saveData(data);
  updateSummaryAndChart();

  // 簡単な演出
  flashSuccess();
}

function flashSuccess() {
  timerDisplay.classList.add("flash-success");
  setTimeout(() => {
    timerDisplay.classList.remove("flash-success");
  }, 800);
}

// 成功フラッシュ用のスタイル追加
const style = document.createElement("style");
style.textContent = `
  .flash-success {
    box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.9), 0 0 32px rgba(129, 199, 132, 0.8);
    border-color: rgba(165, 214, 167, 0.9) !important;
  }
`;
document.head.appendChild(style);

// ====== フルスクリーン試行 ======
function requestFullscreenSoft() {
  const elem = document.documentElement;
  const anyDoc = /** @type {any} */ (document);

  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(() => {});
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (anyDoc.msRequestFullscreen) {
    anyDoc.msRequestFullscreen();
  }
}

// ====== イベント紐付け ======
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ====== PWA: Service Worker 登録 ======
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

// 初期表示
applyNewDurationFromInput();
updateSummaryAndChart();
updateWaveByProgress();

// ====== アプリ離脱時の失敗演出 ======
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && isRunning) {
    handleEarlyExit();
  }
});

// 途中終了の処理（演出中心）
function handleEarlyExit() {
  isRunning = false;
  clearInterval(timerId);

  // 記録は残さない（＝達成感が消える）
  // → 完走時の handleFocusCompleted() を呼ばない

  // 波が崩れる演出
  collapseWave();

  // 失敗演出
  showFailEffect();

  // UIリセット
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = false;
  minutesInput.disabled = false;
}

// 波が崩れる演出
function collapseWave() {
  waveSvg.style.transition = "transform 0.6s ease-in, opacity 0.6s ease-in";
  waveSvg.style.transform = "translate3d(0, 45%, 0)";
  waveSvg.style.opacity = "0.35";
}

// 失敗演出
function showFailEffect() {
  timerDisplay.textContent = "失敗…";
  timerDisplay.style.color = "#ef5350";

  timerDisplay.classList.add("fail-flash");
  setTimeout(() => {
    timerDisplay.classList.remove("fail-flash");
    timerDisplay.style.color = ""; // 元に戻す
  }, 1200);
}

// ====== スマホ対応：アプリ離脱で失敗扱い ======
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && isRunning) {
    handleEarlyExit();
  }
});

// iOS Safari 対策（ページ遷移・タブ切り替え）
window.addEventListener("pagehide", () => {
  if (isRunning) handleEarlyExit();
});
function requestFullscreenSoft() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(() => {});
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }

  // スマホでの画面ロック防止（対応ブラウザのみ）
  if (navigator.wakeLock) {
    navigator.wakeLock.request("screen").catch(() => {});
  }
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
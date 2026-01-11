// app.js

const $ = (s) => document.querySelector(s);
const chatEl = $("#chat");
const micBtn = $("#mic-btn");
const micLabel = $("#mic-label");
const speakBtn = $("#speak-btn");
const noteEl = $("#note");
const statusText = $("#status-text");
const statusPill = $("#status-pill");
const appShell = $(".app-shell");
const themeRow = $("#theme-row");

const todayTurnsEl = $("#today-turns");
const todayMinutesEl = $("#today-minutes");
const todayLevelEl = $("#today-level");
const todayStreakEl = $("#today-streak");
const wavePath = document.querySelector(".wave-bg path");

let currentTheme = "daily";
let isListening = false;
let lastBotReply = "";
let history = [];

let todayTurns = 0;
let sessionStart = Date.now();

/* ========== util: today stats ========== */

const todayKey = new Date().toISOString().slice(0, 10);

function loadTodayStats() {
  const saved = JSON.parse(localStorage.getItem("waveTalkStats") || "{}");
  const streak = JSON.parse(localStorage.getItem("waveTalkStreak") || "{}");
  const today = saved[todayKey] || { turns: 0, totalMs: 0 };

  todayTurns = today.turns || 0;
  sessionStart = Date.now();

  const streakDays = streak.count || 1;
  todayStreakEl.textContent = `${streakDays} day${streakDays > 1 ? "s" : ""}`;

  updateTodayUI(today.totalMs);
}

function saveTurn() {
  const now = Date.now();
  const elapsed = now - sessionStart;

  const saved = JSON.parse(localStorage.getItem("waveTalkStats") || "{}");
  const today = saved[todayKey] || { turns: 0, totalMs: 0 };

  today.turns += 1;
  today.totalMs += elapsed;
  saved[todayKey] = today;

  localStorage.setItem("waveTalkStats", JSON.stringify(saved));
  sessionStart = now;

  todayTurns = today.turns;
  updateTodayUI(today.totalMs);
}

function updateTodayUI(totalMs) {
  const minutes = Math.floor(totalMs / 60000);
  todayTurnsEl.textContent = String(todayTurns);
  todayMinutesEl.textContent = `${minutes} min`;

  let level = "Calm";
  let glow = 0.3;

  if (todayTurns >= 5 && todayTurns < 15) {
    level = "Ripple";
    glow = 0.5;
  } else if (todayTurns >= 15 && todayTurns < 30) {
    level = "Wave";
    glow = 0.7;
  } else if (todayTurns >= 30) {
    level = "Storm";
    glow = 1.0;
  }

  todayLevelEl.textContent = level;

  if (wavePath) {
    wavePath.style.filter = `blur(10px) drop-shadow(0 0 ${18 * glow}px rgba(56,189,248,${glow}))`;
    wavePath.style.opacity = 0.25 + glow * 0.3;
  }
}

/* ========== error mode ========== */

function setErrorMode(on, message) {
  if (on) {
    appShell.classList.add("error-mode");
    statusPill.classList.add("error");
    micBtn.classList.add("error");
    noteEl.textContent = message || "Something went wrong. Let’s try again.";
    noteEl.classList.add("error");
    statusText.textContent = "Error";

    setTimeout(() => {
      appShell.classList.remove("error-mode");
      micBtn.classList.remove("error");
    }, 1200);
  } else {
    statusPill.classList.remove("error");
    noteEl.classList.remove("error");
  }
}

/* ========== chat rendering ========== */

function addMessage(text, sender = "bot") {
  const row = document.createElement("div");
  row.className = `msg-row ${sender === "user" ? "user" : "bot"}`;

  const msg = document.createElement("div");
  msg.className = `msg ${sender === "user" ? "user" : "bot"}`;
  msg.textContent = text;

  const meta = document.createElement("div");
  meta.className = "msg-meta";
  meta.textContent = sender === "user" ? "You" : "AI";

  row.appendChild(msg);
  row.appendChild(meta);
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

addMessage("Hi, I'm Wave Talk. Choose a theme and say something in English!", "bot");

/* ========== theme select ========== */

themeRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const theme = btn.dataset.theme;
  if (!theme) return;

  currentTheme = theme;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");

  addMessage(`Theme switched to ${theme.toUpperCase()}. Say something in English.`, "bot");
});

/* ========== speech recognition ========== */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add("listening");
    micLabel.textContent = "Listening...";
    statusText.textContent = "Listening";
    noteEl.textContent = "英語で話しかけてください。";
    noteEl.classList.remove("error");
  };

  recognition.onerror = (event) => {
    isListening = false;
    micBtn.classList.remove("listening");
    micLabel.textContent = "Tap to speak";
    statusText.textContent = "Error";
    setErrorMode(true, "うまく聞き取れませんでした。少しゆっくり、もう一度話してみてください。");
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove("listening");
    micLabel.textContent = "Tap to speak";
    if (!noteEl.classList.contains("error")) {
      statusText.textContent = "Idle";
    }
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((r) => r[0].transcript)
      .join(" ")
      .trim();

    if (!transcript) {
      setErrorMode(true, "うまく認識できませんでした。もう一度試してください。");
      return;
    }

    noteEl.textContent = "";
    noteEl.classList.remove("error");
    handleUserSpeech(transcript);
  };
} else {
  noteEl.textContent = "このブラウザは Web Speech API に対応していません。Chrome / Edge を使用してください。";
  noteEl.classList.add("error");
  micBtn.disabled = true;
}

/* ========== speech synthesis ========== */

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 1.0;
  utter.pitch = 1.0;

  utter.onstart = () => speakBtn.classList.add("active");
  utter.onend = () => speakBtn.classList.remove("active");

  window.speechSynthesis.speak(utter);
}

/* ========== LLM API ========== */

async function callLLMApi(userText, theme) {
  const endpoint = "/api/chat";

  const payload = {
    userText,
    theme,
    formality: theme === "business" ? "polite" : "neutral",
    level: "B1",
    speed: "normal",
    roleplayId:
      theme === "roleplay"
        ? "airport_checkin" // とりあえず固定。ここをUIから変えてもいい
        : null,
    history,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("API error: " + res.status);

    const data = await res.json();
    return data.reply || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error(err);
    setErrorMode(true, "AI がうまく考えられませんでした。もう一度話しかけてみてください。");
    return "Sorry, something went wrong on my side. Could you say that again?";
  }
}

/* ========== main conversation flow ========== */

async function handleUserSpeech(text) {
  addMessage(text, "user");
  history.push({ role: "user", content: text });
  saveTurn();

  statusText.textContent = "Thinking";

  const reply = await callLLMApi(text, currentTheme);
  lastBotReply = reply;
  history.push({ role: "assistant", content: reply });

  addMessage(reply, "bot");
  statusText.textContent = "Idle";
  speak(reply);
}

/* ========== events ========== */

micBtn.addEventListener("click", () => {
  if (!recognition) return;
  if (isListening) {
    recognition.stop();
  } else {
    setErrorMode(false);
    recognition.start();
  }
});

speakBtn.addEventListener("click", () => {
  if (!lastBotReply) {
    noteEl.textContent = "まだAIの返信がありません。まずは話しかけてみましょう。";
    noteEl.classList.add("error");
    return;
  }
  noteEl.textContent = "";
  noteEl.classList.remove("error");
  speak(lastBotReply);
});

/* ========== PWA service worker ========== */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  });
}

/* ========== init ========== */

loadTodayStats();
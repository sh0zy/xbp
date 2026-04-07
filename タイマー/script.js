// script.js - simple countdown timer
const display = document.getElementById('display');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setBtn = document.getElementById('set');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const presetsEl = document.getElementById('presets');
const savePresetBtn = document.getElementById('save-preset');
const presetNameInput = document.getElementById('preset-name');
const lapList = document.getElementById('lap-list');

let totalSeconds = 30;
let remaining = totalSeconds;
let ticker = null;
let running = false;
let laps = [];
let presets = [];

function fmt(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const sec = (s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}

function updateDisplay(){
  display.textContent = fmt(remaining);
}

function tick(){
  if(remaining <= 0){
    stopTimer();
    beep();
    return;
  }
  remaining -= 1;
  updateDisplay();
}

function startTimer(){
  if(running) return;
  running = true;
  ticker = setInterval(tick, 1000);
  startBtn.classList.add('primary');
}

function stopTimer(){
  running = false;
  clearInterval(ticker);
  ticker = null;
  startBtn.classList.remove('primary');
}

function resetTimer(){
  stopTimer();
  remaining = totalSeconds;
  updateDisplay();
}

function recordLap(){
  if(!running) return;
  const elapsed = totalSeconds - remaining;
  const lapTime = elapsed; // seconds since start
  const label = fmt(lapTime);
  const item = { time: remaining, elapsed: lapTime, label, at: new Date().toISOString() };
  laps.unshift(item);
  renderLaps();
}

function renderLaps(){
  lapList.innerHTML = '';
  laps.forEach((l, i) => {
    const li = document.createElement('li');
    li.textContent = `#${laps.length - i}  残り ${fmt(l.time)}  経過 ${fmt(l.elapsed)}`;
    lapList.appendChild(li);
  });
}

// presets
function loadPresets(){
  try{
    const raw = localStorage.getItem('timerPresets');
    if(raw) presets = JSON.parse(raw);
  }catch(e){ console.warn('load presets', e); }
  renderPresets();
}

function savePresets(){
  try{ localStorage.setItem('timerPresets', JSON.stringify(presets)); }catch(e){console.warn(e)}
}

function renderPresets(){
  presetsEl.innerHTML = '';
  presets.forEach((p, idx) => {
    const btn = document.createElement('button');
    btn.className = 'preset-chip';
    btn.textContent = p.name;
    btn.addEventListener('click', ()=>{
      totalSeconds = p.seconds;
      remaining = totalSeconds;
      updateDisplay();
      document.querySelectorAll('.preset-chip').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
    });
    presetsEl.appendChild(btn);
  });
}

function addPreset(){
  const name = (presetNameInput.value || '').trim();
  if(!name) return alert('プリセット名を入力してください');
  if(totalSeconds <= 0) return alert('有効な時間を設定してください');
  presets.unshift({ name, seconds: totalSeconds });
  // keep max 8
  presets = presets.slice(0,8);
  savePresets();
  renderPresets();
  presetNameInput.value = '';
}

function setTimer(){
  const m = Math.max(0, parseInt(minutesInput.value || 0, 10));
  let s = Math.max(0, parseInt(secondsInput.value || 0, 10));
  if(s > 59) s = 59;
  totalSeconds = m * 60 + s;
  remaining = totalSeconds;
  updateDisplay();
}

function beep(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    // quick fade in
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
    setTimeout(()=>{ o.stop(); ctx.close(); }, 1200);
  }catch(e){
    // ignore audio errors
    console.warn('beep failed', e);
  }
}

// events
setBtn.addEventListener('click', setTimer);
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
  if(running) stopTimer(); else startTimer();
});
resetBtn.addEventListener('click', resetTimer);

lapBtn.addEventListener('click', recordLap);
savePresetBtn.addEventListener('click', addPreset);

// init
loadPresets();
updateDisplay();


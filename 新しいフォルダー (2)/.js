// =======================
// アプリ全体の状態
// =======================
let appState = {
  structure: null,
  history: [],
  future: [],
  projectName: "My First Wave App",
  guideMode: true,
  minimalMode: true,
};

// 簡易サンプル生成（本当はLLMなどに置き換え）
function analyzeToStructure(text) {
  // めちゃ簡易：メモアプリ固定のモック
  return {
    screens: [
      {
        id: "home",
        name: "ホーム",
        components: [
          { type: "title", text: "メモ一覧" },
          { type: "list", items: ["サンプルメモ1", "サンプルメモ2"] },
          { type: "button", text: "新しいメモ" }
        ]
      }
    ],
    transitions: []
  };
}

// =======================
// 構造の更新＋Undo/Redo
// =======================
function updateStructure(mutatorFn, label = "変更", options = {}) {
  const prev = appState.structure
    ? JSON.parse(JSON.stringify(appState.structure))
    : null;

  const next = mutatorFn(prev);
  appState.structure = next;

  if (!options.skipHistory && prev) {
    appState.history.push({ label, structure: prev });
    appState.future = [];
  }

  rerenderAll();
}

// =======================
// レンダリング
// =======================
function rerenderAll() {
  renderPreview(appState.structure);
  updateAutoSaveStatus();
  renderGuideMessage();
}

// 簡易プレビュー（モック表示）
function renderPreview(struct) {
  const frame = document.getElementById("previewFrame");
  if (!struct) {
    frame.innerHTML = `<div class="preview-placeholder">
      ここにあなたのアプリが表示されます。
    </div>`;
    return;
  }

  const home = struct.screens[0];
  let html = "";

  home.components.forEach(c => {
    if (c.type === "title") {
      html += `<h2>${c.text}</h2>`;
    } else if (c.type === "list") {
      html += `<ul>${c.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    } else if (c.type === "button") {
      html += `<button class="wave-btn">${c.text}</button>`;
    }
  });

  frame.innerHTML = html;
}

function updateAutoSaveStatus() {
  const el = document.getElementById("autoSaveStatus");
  el.textContent = "自動保存済み";
}

// =======================
// ミニマムモード切り替え
// =======================
const minimalToggle = document.getElementById("minimalModeToggle");
minimalToggle.addEventListener("change", () => {
  appState.minimalMode = minimalToggle.checked;
  setMinimalMode(appState.minimalMode);
});

function setMinimalMode(isMinimal) {
  const advanced = document.getElementById("advancedPanels");
  advanced.style.display = isMinimal ? "none" : "block";
  renderGuideMessage();
}

// =======================
// ガイドモード切り替え
// =======================
const guideToggle = document.getElementById("guideModeToggle");
guideToggle.addEventListener("click", () => {
  appState.guideMode = !appState.guideMode;
  guideToggle.textContent = appState.guideMode
    ? "ガイドモード ON"
    : "ガイドモード OFF";
  renderGuideMessage();
});

// =======================
// ガイドメッセージ
// =======================
function renderGuideMessage() {
  const guide = document.getElementById("guideArea");
  if (!appState.guideMode) {
    guide.textContent = "プロモード：自由に編集できます。迷ったらガイドモードをONにしてね。";
    return;
  }

  // めちゃ簡易なルールベース
  if (!appState.structure) {
    guide.textContent = "💡 次は「アプリの説明」を書いてみよう。あなたの言葉で大丈夫だよ。";
  } else {
    guide.textContent = "💡 プレビューを触ってみよう。次に画面を増やしたくなったら教えてね。";
  }
}

// =======================
// 入力と自動生成
// =======================
const appInput = document.getElementById("appInput");
let inputTimer = null;

appInput.addEventListener("input", () => {
  if (inputTimer) clearTimeout(inputTimer);
  inputTimer = setTimeout(() => {
    const text = appInput.value.trim();
    if (!text) {
      appState.structure = null;
      rerenderAll();
      return;
    }
    const struct = analyzeToStructure(text);
    appState.history = [];
    appState.future = [];
    appState.structure = struct;
    rerenderAll();
  }, 600);
});

// =======================
// Undo / Redo
// =======================
document.getElementById("undoBtn").addEventListener("click", () => {
  if (appState.history.length === 0) return;
  const current = appState.structure;
  const prev = appState.history.pop();
  if (current) appState.future.push({ label: "redo", structure: current });
  appState.structure = prev.structure;
  rerenderAll();
});

document.getElementById("redoBtn").addEventListener("click", () => {
  if (appState.future.length === 0) return;
  const current = appState.structure;
  const next = appState.future.pop();
  if (current) appState.history.push({ label: "undo", structure: current });
  appState.structure = next.structure;
  rerenderAll();
});

// =======================
// 初期化
// =======================
window.addEventListener("load", () => {
  appState.minimalMode = true;
  minimalToggle.checked = true;
  setMinimalMode(true);
  renderGuideMessage();
  renderPreview(null);
});

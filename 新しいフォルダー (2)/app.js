document.getElementById("generateBtn").addEventListener("click", () => {
  const text = document.getElementById("appInput").value;

  saveLocal(text);
  const debug = validate(text);
  document.getElementById("debugArea").innerHTML = debug;

  const structure = analyze(text);
  drawFlowMap(structure);
  generatePreview(structure);
  generateGuide(structure);
  generateImprove(structure);
});

/* 優しいデバッグ */
function validate(text) {
  if (text.length < 10) return "もう少し詳しく書いてみてください。";
  if (!text.includes("画面")) return "画面構成が見つかりません。例: '画面は2つ'";
  return "OK";
}

/* 目的推測AI（簡易版） */
function analyze(text) {
  const isMemo = text.includes("メモ");
  const isTodo = text.includes("タスク");

  return {
    name: isMemo ? "Memo App" : isTodo ? "Todo App" : "Custom App",
    screens: extractScreens(text)
  };
}

/* 画面抽出 */
function extractScreens(text) {
  if (text.includes("ホーム")) return ["ホーム", "詳細"];
  return ["メイン"];
}

/* プレビュー生成 */
function generatePreview(structure) {
  const frame = document.getElementById("previewFrame");
  const html = `
    <html><body>
      <h1>${structure.name}</h1>
      ${structure.screens.map(s => `<div><h2>${s}</h2></div>`).join("")}
    </body></html>
  `;
  frame.srcdoc = html;
}

/* 画面遷移マップ */
function drawFlowMap(structure) {
  const canvas = document.getElementById("flowMap");
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 200;

  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";

  structure.screens.forEach((s, i) => {
    ctx.fillText(s, 20, 40 + i * 40);
    if (i < structure.screens.length - 1) {
      ctx.fillText("↓", 20, 60 + i * 40);
    }
  });
}

/* 自動保存 */
function saveLocal(text) {
  localStorage.setItem("wave_app_input", text);
}

/* 使い方ガイド生成 */
function generateGuide(structure) {
  document.getElementById("guideArea").innerHTML =
    `${structure.screens.length}画面のアプリです。各画面をタップして移動できます。`;
}

/* 改善提案AI */
function generateImprove(structure) {
  document.getElementById("improveArea").innerHTML =
    structure.screens.length < 2
      ? "画面をもう1つ追加すると使いやすくなります。"
      : "良い構成です。";
}

/* ガイドモード */
const guideQuestions = [
  { id: "purpose", text: "どんなアプリを作りたい？" },
  { id: "screens", text: "画面はいくつ必要？" },
  { id: "theme", text: "どんな雰囲気が好き？（波 / ネオン / ガラス）" }
];

let guideAnswers = {};
let guideIndex = 0;

document.getElementById("guidedModeBtn").addEventListener("click", startGuideMode);

function startGuideMode() {
  guideIndex = 0;
  guideAnswers = {};
  showGuideQuestion();
}

function showGuideQuestion() {
  const q = guideQuestions[guideIndex];
  document.getElementById("appInput").value = q.text;
}

function answerGuide(text) {
  const q = guideQuestions[guideIndex];
  guideAnswers[q.id] = text;

  guideIndex++;

  if (guideIndex < guideQuestions.length) {
    showGuideQuestion();
  } else {
    finalizeGuide();
  }
}

function finalizeGuide() {
  const generated = `
${guideAnswers.purpose}アプリを作りたい。
画面は${guideAnswers.screens}つ。
テーマは${guideAnswers.theme}。
  `;
  document.getElementById("appInput").value = generated;
  document.body.classList.add("wave-success");
}
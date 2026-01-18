const TEMPLATES = {
  memo: `
メモアプリを作りたい。
画面は2つ。ホームと詳細。
ホームにはメモ一覧と「新規作成」ボタン。
詳細画面にはタイトル入力と本文入力。
`,
  todo: `
タスク管理アプリ。
ホームにタスクリストと追加ボタン。
詳細画面で編集できるようにしたい。
`
};

window.addEventListener("load", () => {
  const list = document.getElementById("templateList");
  Object.entries(TEMPLATES).forEach(([key, text]) => {
    const div = document.createElement("div");
    div.innerHTML = `<button onclick="loadTemplate('${key}')">${key} テンプレート</button>`;
    list.appendChild(div);
  });
});

function loadTemplate(key) {
  document.getElementById("appInput").value = TEMPLATES[key];
}
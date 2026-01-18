const COMPONENTS = {
  button: {
    label: "ボタン",
    example: `<button class="wave-btn">クリック</button>`
  },
  input: {
    label: "入力欄",
    example: `<input class="wave-input" placeholder="入力してください">`
  },
  textarea: {
    label: "テキストエリア",
    example: `<textarea class="wave-textarea"></textarea>`
  },
  list: {
    label: "リスト",
    example: `<ul class="wave-list"><li>アイテム</li></ul>`
  },
  card: {
    label: "カード",
    example: `<div class="wave-card"><h3>タイトル</h3><p>内容</p></div>`
  }
};

window.addEventListener("load", () => {
  const list = document.getElementById("componentList");
  Object.entries(COMPONENTS).forEach(([key, comp]) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${comp.label}</strong><pre>${comp.example}</pre>`;
    list.appendChild(div);
  });
});
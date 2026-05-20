// 自主制作 アプリカタログ — new app/ 配下の8アプリ。
// すべて xbp リポジトリの GitHub Pages 配下に同梱（apps/<slug>/）。
// 各アプリは静的ファイルとしてビルド済み。配信先は単一の GitHub Pages のみ。

var apps = [
    {
        id: "01",
        slug: "focus-recipe",
        type: "React + Vite + Capacitor",
        category: "focus",
        title: "Focus Recipe",
        description: "「自分が一番集中できる条件」をレシピのように記録・比較できる集中支援アプリ。タイマー × メモ × 振り返りで自分専用の集中処方箋を育てます。",
        icon: "../images/apps/focus-recipe.png",
        webUrl: "../apps/focus-recipe/index.html",
        apkUrl: null,
        meta: ["React 19", "Tailwind v4", "PWA + Capacitor 8"]
    },
    {
        id: "02",
        slug: "not-today",
        type: "React + Vite + Capacitor",
        category: "life",
        title: "Not Today",
        description: "衝動買いをそっと待たせるアプリ。「今日は買わない」を一覧化して、欲しいものを冷却期間つきで眺める。本当に必要だったかを後から振り返れます。",
        icon: "../images/apps/not-today.png",
        webUrl: "../apps/not-today/index.html",
        apkUrl: "../not today.apk",
        meta: ["React 19", "Tailwind v4", "PWA"]
    },
    {
        id: "03",
        slug: "noteframe",
        type: "React + Vite + Capacitor",
        category: "note",
        title: "NoteFrame",
        description: "カード型フレームでメモを枠取りするノートアプリ。思考を“一枚絵”として残し、後から並べ替え・タグ整理ができる構造化メモ環境。",
        icon: "../images/apps/noteframe.png",
        webUrl: "../apps/noteframe/index.html",
        apkUrl: null,
        meta: ["React 19", "Tailwind v4", "Capacitor + Preferences"]
    },
    {
        id: "04",
        slug: "taskflow",
        type: "React + Vite + Capacitor",
        category: "task",
        title: "TaskFlow",
        description: "今日の一歩を、迷わずに。タスクを“流れ”として整え、最小単位から着手できるよう導くタスクアプリ。重さを感じさせない設計で続けやすい。",
        icon: "../images/apps/taskflow.png",
        webUrl: "../apps/taskflow/index.html",
        apkUrl: null,
        meta: ["React 18", "Tailwind v3", "Capacitor 6"]
    },
    {
        id: "05",
        slug: "three-minute-start",
        type: "React + Vite + Capacitor",
        category: "task",
        title: "3-Minute Start",
        description: "やる気ではなく最初の3分だけ動かす、行動の着火装置アプリ。タップしたら3分だけ始めて、続くかどうかは終わってから決められます。",
        icon: "../images/apps/three-minute-start.png",
        webUrl: "../apps/three-minute-start/index.html",
        apkUrl: "../3-minite start.apk",
        meta: ["React 19", "Tailwind v3", "Local Notifications"]
    },
    {
        id: "06",
        slug: "keshibato",
        type: "React + Vite + Capacitor",
        category: "play",
        title: "ケシバト",
        description: "放課後の机を戦場にする消しゴム対戦ゲーム。装備とフィールドを組み合わせて指弾きで勝負する、PWAでもAndroidでも動く軽量ゲーム。",
        icon: "../images/apps/keshibato.png",
        webUrl: "../apps/keshibato/index.html",
        apkUrl: null,
        meta: ["React 18", "Zustand", "PWA"]
    },
    {
        id: "07",
        slug: "screenshot-todo",
        type: "React + Vite + Capacitor",
        category: "note",
        title: "スクショToDo",
        description: "撮ったスクショを「後でやる」に変換するアプリ。画面メモを行動アイテムとして並べ、リマインドで取りこぼしを防ぎます。",
        icon: "../images/apps/screenshot-todo.png",
        webUrl: "../apps/screenshot-todo/index.html",
        apkUrl: null,
        meta: ["React 18", "Tailwind v3", "Local Notifications"]
    },
    {
        id: "08",
        slug: "english-quest-rpg",
        type: "React + Vite + Capacitor",
        category: "study",
        title: "English Quest RPG",
        description: "英会話をターン制RPGとして遊ぶ学習アプリ。音声認識でフレーズを発話し、敵を倒しながら英語フレーズを定着させる遊び心ある学習体験。",
        icon: "../images/apps/english-quest-rpg.png",
        webUrl: "../apps/english-quest-rpg/index.html",
        apkUrl: null,
        meta: ["React 18", "Tailwind v3", "Speech Recognition"]
    }
];

var categories = [
    { id: "all",   label: "すべて" },
    { id: "focus", label: "集中・フロー" },
    { id: "task",  label: "タスク管理" },
    { id: "note",  label: "ノート・記録" },
    { id: "life",  label: "生活・習慣" },
    { id: "study", label: "学習" },
    { id: "play",  label: "遊び・ゲーム" }
];

function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderCards(items, containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    if (!items.length) {
        container.innerHTML = '<p class="empty-note">該当するアプリはありません。</p>';
        return;
    }

    container.innerHTML = items.map(function (item) {
        var metaTags = item.meta.map(function (entry) {
            return '<span>' + entry + '</span>';
        }).join("");

        var buttons = [];
        buttons.push(
            '<a class="app-btn app-btn--primary" href="' + escapeAttr(item.webUrl) + '" target="_blank" rel="noopener noreferrer">' +
                '<span>Webアプリを開く</span>' +
                '<span class="app-btn-arrow">→</span>' +
            '</a>'
        );
        if (item.apkUrl) {
            buttons.push(
                '<a class="app-btn app-btn--ghost" href="' + escapeAttr(item.apkUrl) + '" download>' +
                    'APKを保存' +
                '</a>'
            );
        }

        return '<article class="app-card" data-category="' + escapeAttr(item.category) + '">' +
            '<div class="app-card-head">' +
                '<div class="app-card-icon">' +
                    '<img src="' + escapeAttr(item.icon) + '" alt="' + escapeAttr(item.title) + ' アイコン" loading="lazy">' +
                '</div>' +
                '<div class="app-card-id">#' + item.id + '</div>' +
            '</div>' +
            '<div class="app-card-body">' +
                '<span class="app-card-tag">' + item.type + '</span>' +
                '<h3 class="app-card-title">' + item.title + '</h3>' +
                '<p class="app-card-text">' + item.description + '</p>' +
                '<div class="app-card-meta">' + metaTags + '</div>' +
            '</div>' +
            '<div class="app-card-actions">' + buttons.join("") + '</div>' +
        '</article>';
    }).join("");
}

function renderTabs(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = categories.map(function (cat) {
        var count = cat.id === "all"
            ? apps.length
            : apps.filter(function (a) { return a.category === cat.id; }).length;
        var active = cat.id === "all" ? " is-active" : "";
        return '<button type="button" class="filter-tab' + active + '" data-filter="' + cat.id + '">' +
                   '<span>' + cat.label + '</span>' +
                   '<span class="filter-tab-count">' + count + '</span>' +
               '</button>';
    }).join("");

    container.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        var filter = btn.getAttribute("data-filter");
        container.querySelectorAll(".filter-tab").forEach(function (el) {
            el.classList.toggle("is-active", el === btn);
        });
        var filtered = filter === "all"
            ? apps
            : apps.filter(function (a) { return a.category === filter; });
        renderCards(filtered, "[data-app-grid]");
    });
}

renderTabs("[data-app-tabs]");
renderCards(apps, "[data-app-grid]");

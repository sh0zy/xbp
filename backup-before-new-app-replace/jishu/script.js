var apps = [
    { id: "01", type: "Android APK", category: "health", title: "Fit Forge", description: "自分だけのトレーニングメニューを組み立てて実行できるフィットネスアプリ。種目・セット・休憩を自由に設定し、ワークアウトの記録と振り返りまでをサポートします。", href: "../de34/apps/training-release.apk", meta: ["3.31 MB", "Updated 2026.04.04"] },
    { id: "02", type: "Android APK", category: "focus", title: "Focus Recipe", description: "集中したい作業をレシピのようにステップ化し、タイマーと組み合わせて実行できるアプリ。作業→休憩のリズムを自分好みにカスタマイズして、生産性を高めます。", href: "../de34/apps/screen-release.apk", meta: ["3.09 MB", "Updated 2026.04.04"] },
    { id: "03", type: "Android APK", category: "life", title: "朝支度ルート", description: "朝の準備をルーティン化して時間通りに家を出るためのアプリ。起床から出発までのタスクを順番に表示し、各ステップの所要時間をカウントダウンで管理します。", href: "../de34/apps/mor.apk", meta: ["2.90 MB", "Updated 2026.04.07"] },
    { id: "04", type: "Android APK", category: "note", title: "Screenshot Inbox", description: "スクショを忘れ物から行動に変えるアプリ。取り込み → テキスト抽出 → 自動分類 → リマインド → 行動化まで一気通貫で管理できます。", href: "../ScreenshotInbox.apk", meta: ["3.00 MB", "React + Capacitor", "Updated 2026.04.07"] },
    { id: "05", type: "Android APK", category: "note", title: "NoteFrame", description: "思いついたアイデアをカード形式でサッと書き留め、タグやフレームで整理できるノートアプリ。シンプルな操作で素早くメモを残し、あとから見返しやすく構造化します。", href: "../noteh.apk", meta: ["4.10 MB", "Updated 2026.04.07"] },
    { id: "06", type: "Android APK", category: "play", title: "World Play 50", description: "50のミニチャレンジを通じて日常を冒険に変えるアプリ。散歩・観察・発見などのお題をランダムに提示し、身の回りの世界を遊びながら再発見できます。", href: "../world pla.apk", meta: ["4.30 MB", "Updated 2026.03.25"] },
    { id: "07", type: "Android APK", category: "task", title: "3-Minute Start", description: "「まず3分だけやる」で行動のハードルを下げるアプリ。やりたいことを登録して3分タイマーをスタートするだけ。小さな一歩が習慣化につながります。", href: "../3-minite start.apk", meta: ["Updated 2026.04"] },
    { id: "08", type: "Android APK", category: "task", title: "Not Today", description: "先延ばしにしがちなタスクを「今日はやらない」と明示的に選ぶことで、本当にやるべきことに集中できるアプリ。逆転の発想でタスク管理をシンプルにします。", href: "../not today.apk", meta: ["Updated 2026.04"] },
    { id: "09", type: "Android APK", category: "task", title: "PDCA Flow", description: "PDCAサイクルを日常のタスク管理に取り入れるアプリ。Plan→Do→Check→Actの流れを可視化し、継続的な改善をサポートします。", href: "../pdca.apk", meta: ["3.20 MB", "Updated 2026.04"] },
    { id: "10", type: "Android APK", category: "life", title: "FlowNest", description: "朝と夜のルーティーンをひとつにまとめて管理できるアプリ。起床から就寝までの流れを巣（ネスト）のように組み立て、毎日のリズムを整えます。", href: "../flownest.apk", meta: ["2.98 MB", "Updated 2026.04.13"] },
    { id: "11", type: "Android APK", category: "study", title: "Kiwadori", description: "大学の単位取得をよりリアルに管理するためのアプリ。各授業の出席回数や必要回数をカウントし、「あと何回休めるか」「単位が取れるか」をきわどく見極めます。", href: "../kiwadori.apk", meta: ["3.08 MB", "Updated 2026.04.13"] },
    { id: "12", type: "Android APK", category: "life", title: "Nightback", description: "夜のルーティーンを可視化する夜専用アプリ。就寝前にやることを一覧で並べ、進み具合をチェックしながら「帰ってから寝るまで」をスムーズに整えます。", href: "../nightback.apk", meta: ["4.41 MB", "Updated 2026.04.13"] },
];

var categories = [
    { id: "all",   label: "すべて" },
    { id: "focus", label: "集中・フロー" },
    { id: "task",  label: "タスク管理" },
    { id: "note",  label: "ノート・記録" },
    { id: "life",  label: "生活・習慣" },
    { id: "study", label: "学習・単位" },
    { id: "health",label: "健康・運動" },
    { id: "play",  label: "遊び・発見" },
];

var visualVariants = ["", "card-visual--accent", "card-visual--dark", "card-visual--accent", "", "card-visual--dark"];

var isAndroid = /Android/i.test(navigator.userAgent);
var appCtaLabel = isAndroid ? "APKを開く" : "APKを取得";
var platformNote = isAndroid
    ? "AndroidではカードのCTAからAPKを開き、そのままインストール確認へ進めます。"
    : "PCではAPKを取得し、Android端末へ渡して確認できます。";

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

    container.innerHTML = items
        .map(function (item, index) {
            var variant = visualVariants[index % visualVariants.length];
            var metaTags = item.meta
                .map(function (entry) { return '<span>' + entry + '</span>'; })
                .join("");

            return '<a class="card" href="' + escapeAttr(item.href) + '" data-category="' + (item.category || "") + '">' +
                '<div class="card-visual ' + variant + '"><span class="card-visual-num">' + item.id + '</span></div>' +
                '<div class="card-body">' +
                    '<span class="card-tag">' + item.type + '</span>' +
                    '<h3 class="card-title">' + item.title + '</h3>' +
                    '<p class="card-text">' + item.description + '</p>' +
                    '<div class="feature-band-meta" style="margin-bottom:18px;">' + metaTags + '</div>' +
                    '<span class="card-cta">' + (item.cta || appCtaLabel) + '</span>' +
                '</div>' +
            '</a>';
        })
        .join("");
}

function renderTabs(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = categories
        .map(function (cat) {
            var count = cat.id === "all"
                ? apps.length
                : apps.filter(function (a) { return a.category === cat.id; }).length;
            var active = cat.id === "all" ? " is-active" : "";
            return '<button type="button" class="filter-tab' + active + '" data-filter="' + cat.id + '">' +
                       '<span>' + cat.label + '</span>' +
                       '<span class="filter-tab-count">' + count + '</span>' +
                   '</button>';
        })
        .join("");

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

var noteElement = document.querySelector("[data-platform-note]");
if (noteElement) {
    noteElement.textContent = platformNote;
}

var apps = [
    {
        id: "01",
        type: "Android APK",
        title: "Fit Forge",
        description: "自分だけのトレーニングメニューを組み立てて実行できるフィットネスアプリ。種目・セット・休憩を自由に設定し、ワークアウトの記録と振り返りまでをサポートします。",
        href: "../de34/apps/training-release.apk",
        meta: ["3.31 MB", "Updated 2026.04.04"],
    },
    {
        id: "02",
        type: "Android APK",
        title: "Focus Recipe",
        description: "集中したい作業をレシピのようにステップ化し、タイマーと組み合わせて実行できるアプリ。作業→休憩のリズムを自分好みにカスタマイズして、生産性を高めます。",
        href: "../de34/apps/screen-release.apk",
        meta: ["3.09 MB", "Updated 2026.04.04"],
    },
    {
        id: "03",
        type: "Android APK",
        title: "朝支度ルート",
        description: "朝の準備をルーティン化して時間通りに家を出るためのアプリ。起床から出発までのタスクを順番に表示し、各ステップの所要時間をカウントダウンで管理します。",
        href: "../de34/apps/mor.apk",
        meta: ["2.90 MB", "Updated 2026.04.07"],
    },
    {
        id: "04",
        type: "Android APK",
        title: "Screenshot Inbox",
        description: "スクショを忘れ物から行動に変えるアプリ。取り込み → テキスト抽出 → 自動分類 → リマインド → 行動化まで一気通貫で管理できます。",
        href: "../ScreenshotInbox.apk",
        meta: ["3.00 MB", "React + Capacitor", "Updated 2026.04.07"],
    },
    {
        id: "05",
        type: "Android APK",
        title: "NoteFrame",
        description: "思いついたアイデアをカード形式でサッと書き留め、タグやフレームで整理できるノートアプリ。シンプルな操作で素早くメモを残し、あとから見返しやすく構造化します。",
        href: "../noteh.apk",
        meta: ["4.10 MB", "Updated 2026.04.07"],
    },
    {
        id: "06",
        type: "Android APK",
        title: "World Play 50",
        description: "50のミニチャレンジを通じて日常を冒険に変えるアプリ。散歩・観察・発見などのお題をランダムに提示し、身の回りの世界を遊びながら再発見できます。",
        href: "../world pla.apk",
        meta: ["4.30 MB", "Updated 2026.03.25"],
    },
    {
        id: "07",
        type: "Android APK",
        title: "3-Minute Start",
        description: "「まず3分だけやる」で行動のハードルを下げるアプリ。やりたいことを登録して3分タイマーをスタートするだけ。小さな一歩が習慣化につながります。",
        href: "../3-minite start.apk",
        meta: ["Updated 2026.04"],
    },
    {
        id: "08",
        type: "Android APK",
        title: "Not Today",
        description: "先延ばしにしがちなタスクを「今日はやらない」と明示的に選ぶことで、本当にやるべきことに集中できるアプリ。逆転の発想でタスク管理をシンプルにします。",
        href: "../not today.apk",
        meta: ["Updated 2026.04"],
    },
    {
        id: "09",
        type: "Android APK",
        title: "PDCA Flow",
        description: "PDCAサイクルを日常のタスク管理に取り入れるアプリ。Plan→Do→Check→Actの流れを可視化し、継続的な改善をサポートします。",
        href: "../pdca.apk",
        meta: ["3.20 MB", "Updated 2026.04"],
    },
];

var isAndroid = /Android/i.test(navigator.userAgent);
var appCtaLabel = isAndroid ? "APKを開く" : "APKを取得";
var platformNote = isAndroid
    ? "AndroidではカードのCTAからAPKを開き、そのままインストール確認へ進めます。"
    : "PCではAPKを取得し、Android端末へ渡して確認できます。";

function renderCards(items, containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = items
        .map(function (item) {
            var metaTags = item.meta
                .map(function (entry) { return '<span>' + entry + '</span>'; })
                .join("");

            return '<article class="content-card">' +
                '<div class="card-head">' +
                    '<div>' +
                        '<p class="card-index">' + item.id + '</p>' +
                        '<h3 class="card-title">' + item.title + '</h3>' +
                    '</div>' +
                    '<span class="card-type">' + item.type + '</span>' +
                '</div>' +
                '<p class="card-description">' + item.description + '</p>' +
                '<div class="card-meta">' + metaTags + '</div>' +
                '<a class="card-cta" href="' + item.href + '">' + (item.cta || appCtaLabel) + '</a>' +
            '</article>';
        })
        .join("");
}

renderCards(apps, "[data-app-grid]");

var noteElement = document.querySelector("[data-platform-note]");
if (noteElement) {
    noteElement.textContent = platformNote;
}

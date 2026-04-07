const apps = [
    {
        id: "01",
        type: "Android APK",
        title: "Training Release",
        description: "トレーニング用の体験を、そのまま端末で確認できる release APK です。",
        href: "./apps/training-release.apk",
        meta: ["3.31 MB", "Updated 2026.04.04"],
    },
    {
        id: "02",
        type: "Android APK",
        title: "Screen Release",
        description: "画面構成や見え方の確認に向いた、軽やかに共有できる release APK です。",
        href: "./apps/screen-release.apk",
        meta: ["3.09 MB", "Updated 2026.04.04"],
    },
    {
        id: "03",
        type: "Android APK",
        title: "MOR",
        description: "追加の試作体験を素早く開けるようにまとめた、コンパクトな APK です。",
        href: "./apps/mor.apk",
        meta: ["2.90 MB", "Updated 2026.04.07"],
    },
    {
        id: "04",
        type: "Android APK",
        title: "Screen Release",
        description: "画面構成や見え方の確認に向いた、軽やかに共有できる release APK です。",
        href: "./apps/screen-release.apk",
        meta: ["3.09 MB", "Updated 2026.04.04"],
    },
    {
        id: "05",
        type: "Android APK",
        title: "Noteh",
        description: "ノートアプリです。アンドロイドであればインストール可能です。",
        href: "../noteh.apk",
        meta: ["Updated 2026.04.07"],
    },
    {
        id: "06",
        type: "Android APK",
        title: "World Pla",
        description: "ワールドアプリです。アンドロイドであればインストール可能です。",
        href: "../world pla.apk",
        meta: ["Updated 2026.04.07"],
    },
];

const isAndroid = /Android/i.test(navigator.userAgent);
const appCtaLabel = isAndroid ? "APKを開く" : "APKを取得";
const platformNote = isAndroid
    ? "AndroidではカードのCTAからAPKを開き、そのままインストール確認へ進めます。"
    : "PCではAPKを取得し、Android端末へ渡して確認できます。";

function renderCards(items, containerSelector) {
    const container = document.querySelector(containerSelector);

    if (!container) {
        return;
    }

    container.innerHTML = items
        .map((item) => {
            const metaTags = item.meta
                .map((entry) => `<span>${entry}</span>`)
                .join("");

            return `
                <article class="content-card">
                    <div class="card-head">
                        <div>
                            <p class="card-index">${item.id}</p>
                            <h3 class="card-title">${item.title}</h3>
                        </div>
                        <span class="card-type">${item.type}</span>
                    </div>
                    <p class="card-description">${item.description}</p>
                    <div class="card-meta">${metaTags}</div>
                    <a class="card-cta" href="${item.href}">${item.cta ?? appCtaLabel}</a>
                </article>
            `;
        })
        .join("");
}

renderCards(apps, "[data-app-grid]");

const noteElement = document.querySelector("[data-platform-note]");

if (noteElement) {
    noteElement.textContent = platformNote;
}

const yearElement = document.querySelector("[data-current-year]");

if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

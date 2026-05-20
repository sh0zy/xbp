# backup-before-new-app-replace

このフォルダは 2026-05-20 に "new app" 配下の8アプリへ自主制作セクションを置き換える前のバックアップです。

## 含まれているもの
- `jishu/index.html` … 旧自主制作ページのテンプレート
- `jishu/script.js`  … 旧 12 アプリのデータと描画ロジック
- `root/index.html`  … ルートトップページ（コピー）

## 元に戻したい場合
1. `cp backup-before-new-app-replace/jishu/index.html ./jishu/index.html`
2. `cp backup-before-new-app-replace/jishu/script.js  ./jishu/script.js`
3. `cp backup-before-new-app-replace/root/index.html  ./index.html`

旧 APK ファイル（flownest.apk / kiwadori.apk / nightback.apk / pdca.apk / not today.apk / noteh.apk / world pla.apk / 3-minite start.apk / css v3.apk / html-app.apk / jsmasterd v7.apk / ScreenshotInbox.apk）はリポジトリ直下に元々あるためそのまま残しています。

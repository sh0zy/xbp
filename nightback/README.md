# NightBack

帰宅してから寝るまでの時間を逆算し、その夜にやるべきことを記録・整理・実行するスマホアプリ。

- React + Vite + TypeScript + Tailwind CSS + Capacitor
- ローカル保存（localStorage, キー: `nightback-app-state-v1`）
- アプリ名: **NightBack** / パッケージ名: **com.nightback.app**

---

## 1. 起動（Web で動作確認）

```sh
cd nightback
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

---

## 2. ビルド + Android 同期

```sh
npm run build
npx cap sync android
```

`android/` フォルダに Capacitor が反映されます。

---

## 3. アイコン / スプラッシュ

配置場所:

- `resources/icon.png` — 1024x1024 PNG（正方形）
- `resources/splash.png` — 2732x2732 PNG（中央ロゴ、深ダーク背景）

Android に反映するには:

```sh
npm install -D @capacitor/assets
npx capacitor-assets generate --android
npx cap sync android
```

画像を置かなくてもビルドは通ります。本番配布前に差し替えてください。

Web 側のタイトル: `index.html` の `<title>NightBack</title>`
Web 側の favicon: `public/favicon.svg`

---

## 4. Debug APK 作成手順（Android Studio）

1. `android/` フォルダを Android Studio で開く
   - File → Open → `nightback/android` を選ぶ
2. 右下の Gradle sync が終わるまで待つ
3. メニュー: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. 右下の通知 **"APK(s) generated successfully"** の *locate* リンクで保存場所が開く

### APK 保存場所

```
nightback/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. APK を実機で開く

以下のどれか:

- **USB 接続**: 端末の `Download/` に `app-debug.apk` をコピー
- **OneDrive / Google Drive**: クラウドに上げて端末から開く
- **Nearby Share / Quick Share**: PC → 端末へ直接送信

端末側:

1. Files アプリ（または通知）から `app-debug.apk` をタップ
2. 「不明なアプリのインストール」を求められたら許可
3. インストール後、ホームに表示される **NightBack** を起動

---

## 6. 実機確認項目

- [ ] ランチャーにアプリ名 **NightBack** が出る
- [ ] アプリアイコンが表示される（未生成時はデフォルト）
- [ ] 起動時スプラッシュが崩れず中央寄せで出る
- [ ] 初回は Onboarding へ飛ぶ
- [ ] Home → 計画 → 実行 → ふりかえり の導線が通る
- [ ] アプリを再起動しても設定・履歴が残る（localStorage）
- [ ] ステータスバーがダーク背景と馴染んでいる

---

## 7. 詰まりやすい点と対処

| 症状 | 原因 / 対処 |
|---|---|
| APK をタップしても開けない | 「不明なアプリのインストール」を許可 / Files アプリからタップ |
| インストールがブロックされる | Play Protect が警告するだけ。「詳細 → インストール」で進む |
| 旧バージョンと競合する | 端末から古い NightBack をアンインストールしてから入れ直す |
| Android Studio に Build APK が出ない | Gradle sync が未完了。左下の進捗完了を待つ |
| Gradle sync が止まる | JDK 17 未満だと失敗。Android Studio 標準 JDK(17+) を使う |
| 画面が真っ白 | `npm run build` → `npx cap sync android` を再実行。`dist/` が無いと失敗 |
| パッケージ名を変えたい | `capacitor.config.ts` と `android/app/build.gradle` の applicationId を揃える |

---

## 8. 最終コマンド一覧

```sh
npm install
npm run dev                # Web 開発
npm run build              # Web ビルド
npx cap sync android       # Android 同期
npx cap open android       # Android Studio で開く
```

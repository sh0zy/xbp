# 3-Minute Start

「やる気を出す」のではなく、「最初の3分だけ始める」ことに集中する行動着火アプリ。
React + Vite + TypeScript + Tailwind CSS + PWA + Capacitor で構築されています。

## コア体験

- やるべきことがあるのに動けないとき、アプリを開く
- 作業を入力 / テンプレを選ぶ
- 「最初の1歩」を1つだけ決める（"開くだけ" でもOK）
- 3分タイマーを開始
- 終了後は自分で選ぶ：
  - ここで終わる（始められた時点で十分）
  - もう3分続ける
  - そのまま続ける

完遂を強制せず、ハードルを下げて「開始」だけを習慣化します。

## 画面構成

- `/` ホーム — 大きな「3分だけ始める」CTA / 最近のテンプレ / 直近セッション
- `/start` スタート — 入力 → タイマー → 結果分岐
- `/templates` テンプレ — レポート、課題、勉強、返信、片付け、洗濯、掃除、読書、志望理由書、面倒な申請
- `/history` 履歴 — 直近セッションの軽い一覧
- `/settings` 設定 — テーマ / 通知 / バイブ / サンプル投入 / データ初期化 / アプリ情報

## ディレクトリ構成

```
src/
  app/router.tsx
  components/
    layout/{AppShell,TopBar,BottomTabBar}.tsx
    common/{PageContainer,PrimaryButton,Card,EmptyState}.tsx
  features/
    home/HomePage.tsx
    start/{StartPage.tsx, components/{TimerRing,FirstStepCard,SessionResultSheet}.tsx}
    templates/{TemplatesPage.tsx, components/TemplateCard.tsx}
    history/{HistoryPage.tsx, components/SessionList.tsx}
    settings/{SettingsPage.tsx, components/SettingRow.tsx}
  lib/{storage.ts, templates.ts, utils.ts}
  store/useAppStore.ts
  types/app.ts
public/
  pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png, favicon.svg
resources/
  icon.png, splash.png
android/
  ...（Capacitor 生成）
capacitor.config.ts
vite.config.ts (vite-plugin-pwa)
tailwind.config.js / postcss.config.js
```

## セットアップ

```powershell
npm install
```

## 開発コマンド

```powershell
npm run dev      # Vite 開発サーバ
npm run build    # 型チェック + 本番ビルド (dist/)
npm run preview  # 本番ビルドのプレビュー
```

## PWA 対応

- `vite-plugin-pwa` で manifest と Service Worker を自動生成
- `display: standalone`、`portrait`、`theme_color: #2b6df6`
- `public/pwa-192x192.png` `public/pwa-512x512.png` `public/apple-touch-icon.png`
- スマホブラウザから「ホーム画面に追加」可能

## Capacitor / Android 連携

- App ID: `com.threeminutestart.app`
- App Name: `3-Minute Start`
- `webDir: dist`
- `androidScheme: https`

### 同期手順

```powershell
npm run build
npx cap sync android
```

### Android Studio で開く

```powershell
npx cap open android
```

初回は Gradle Sync が走ります。SDK/JDK が未設定の場合は Android Studio の指示に従ってください。

### アイコン / スプラッシュの差し替え

`resources/icon.png`（1024x1024 推奨、十分な余白）と `resources/splash.png`（2732x2732 以上推奨）を差し替えた後、

```powershell
npx capacitor-assets generate --android
npm run build
npx cap sync android
```

を実行すると、Android の各 dpi に展開されます。

## localStorage 保存仕様

- キー: `three-minute-start-app-state-v1`
- 保存内容:
  - `version`
  - `templates: TaskTemplate[]`
  - `sessions: StartSession[]`
  - `settings: { themeMode, notificationsEnabled, hapticsEnabled, onboardingCompleted }`
- 不正データ時は安全にデフォルト値へフォールバックし、`JSON.parse` 失敗でも落ちません
- 設定画面からサンプル投入 / データ初期化が可能

## 今後の拡張候補

- 通知（Capacitor Local Notifications）の実装
- バイブの実装（Haptics）
- 連続スタート日数の控えめな可視化
- 任意ノートをセッションに紐づける
- iOS プラットフォーム追加
- サウンド（やさしい合図）

## ライセンス

未設定（個人/学習用途）

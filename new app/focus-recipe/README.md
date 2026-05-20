# Focus Recipe

あなたが一番集中できる条件を見つけるアプリ。

> 「頑張るアプリではなく、集中できる自分を再現するアプリ」

---

## アプリ概要

Focus Recipeは、ユーザーごとの集中しやすい条件を記録・分析し、「自分に効く集中パターンの再現性」を作るためのスマホ向けアプリです。

### 対象ユーザー
- 資格・試験勉強中の学生
- 20代社会人
- 副業・自己学習をしている人

---

## ブランド設定

| 項目 | 値 |
|------|------|
| アプリ名 | Focus Recipe |
| 表示名 | Focus Recipe |
| パッケージ名 (appId) | com.focusrecipe.app |
| バージョン | 1.0.0 |

---

## 技術スタック

| 技術 | バージョン |
|------|------|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | v4 |
| Zustand | 5 |
| Recharts | 3 |
| React Router DOM | 7 |
| Capacitor | 7 |
| vite-plugin-pwa | 1.2 |

---

## セットアップ・実行

```bash
# 依存関係インストール
npm install --legacy-peer-deps

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview
```

---

## Capacitor / Android

```bash
# Webビルド（必須：先に実行）
npm run build

# Android同期
npx cap sync android

# Android Studioで開く
npx cap open android
```

### Android Studioで開く手順

1. `npx cap open android` 実行
2. Android Studio が自動で `android/` フォルダを開く
3. Gradle sync が完了するまで待機
4. デバイス/エミュレータを選んで Run

---

## アイコン・スプラッシュ

| ファイル | 場所 |
|---------|------|
| SVGソース | `public/icons/icon.svg` |
| PWA 192px | `public/icons/icon-192.png` |
| PWA 512px | `public/icons/icon-512.png` |
| Apple Touch | `public/icons/apple-touch-icon.png` |
| Androidアイコン | `android/app/src/main/res/mipmap-*/ic_launcher.png` |
| Androidスプラッシュ | `android/app/src/main/res/drawable-*/splash.png` |

---

## 実装画面

| 画面 | 概要 |
|------|------|
| オンボーディング | アプリ価値説明・初期設定 |
| ホーム | 今日のおすすめ・直近セッション・CTA |
| セッション開始 | タスク種別・場所・音・コンディション・時間 |
| セッション中 | タイマー・完了・中断 |
| セッション振り返り | 集中度・スマホ・達成・メモ |
| 履歴 | 一覧・フィルター・詳細 |
| 分析 | 時間帯別・場所別・音別・睡眠別チャート |
| 集中レシピ | ベスト条件・崩れやすい条件・信頼度 |
| 設定 | プロフィール・データ管理・アプリ情報 |

---

## データ保存

- すべてのデータはローカルストレージ（localStorage）に保存
- 外部サーバー・APIへの通信なし
- 設定画面からデータ初期化・サンプルデータ投入が可能

---

## Release前に残る作業

1. **署名（必須）**
   - `android/` を Android Studio で開く
   - `Build > Generate Signed Bundle / APK`
   - keystore を作成して署名

2. **アイコン差し替え（推奨）**
   - `public/icons/icon.svg` を本格デザインに差し替え
   - `npx cap sync android` で反映

3. **Google Play 提出**
   - ターゲット API レベル確認（API 35以上推奨）
   - `android/app/build.gradle` の `targetSdkVersion` 確認

4. **通知（オプション）**
   - `@capacitor/local-notifications` を追加すれば通知が実装可能

---

## ZIPに含まれる内容

- `src/` - Reactソースコード（TypeScript）
- `public/` - PWAアイコン・SVGソース
- `android/` - Capacitor Androidプロジェクト
- `package.json` / `package-lock.json`
- `tsconfig*.json`
- `vite.config.ts`
- `capacitor.config.ts`
- `README.md`
- ※ `node_modules/` は含まれません（`npm install` で復元）

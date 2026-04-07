# Screenshot Inbox

**スクショを"忘れ物"ではなく"行動"に変えるアプリ**

スマホに溜まったスクリーンショットを取り込み、テキスト抽出・自動分類・リマインド・行動化まで一気通貫で管理できるモバイルアプリです。

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルド**: Vite 8
- **スタイル**: Tailwind CSS 4
- **状態管理**: Zustand (localStorage 永続化)
- **モバイル**: Capacitor (Android)
- **PWA**: Service Worker + manifest.json
- **OCR/分類**: ルールベース (外部API不要)

## アプリ情報

| 項目 | 値 |
|---|---|
| アプリ名 | Screenshot Inbox |
| パッケージ名 | com.screenshotinbox.app |
| 対応プラットフォーム | Web (PWA) / Android |
| データ保存 | ローカルのみ (localStorage) |

## セットアップ

### 必要環境

- Node.js 18+
- npm 9+
- Android Studio (Android ビルド時)

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### プロダクションビルド

```bash
npm run build
```

### Capacitor 同期 (Android)

```bash
npm run build
npx cap sync android
```

### Android Studio で開く

```bash
npx cap open android
```

または Android Studio で `android/` フォルダを直接開いてください。

## MVP 機能一覧

### 画面

1. **オンボーディング** - アプリ説明・サンプルデータ投入
2. **ホーム** - 未整理件数・要対応・救出済み・CTA
3. **取り込み** - 画像複数選択・解析・自動分類
4. **Inbox 一覧** - カテゴリ/状態フィルター・ソート
5. **詳細画面** - 画像プレビュー・抽出情報・リマインド・編集
6. **行動リスト** - 要対応/今日/今週/完了タブ
7. **検索** - テキスト・カテゴリ・状態フィルター
8. **分析** - 救出スコア・カテゴリ内訳・完了率
9. **設定** - サンプルデータ・初期化・アプリ情報

### カテゴリ

- Event / Ticket (イベント・チケット)
- Order / Receipt (注文・レシート)
- Membership / Code (会員証・QR・クーポン)
- Recipe / Food (レシピ・料理)
- Memo / Note (メモ・ノート)
- Other (その他)

### OCR・分類ロジック

- ルールベースのテキスト解析 (外部API不要)
- 日付・時刻・金額・コード・URL の自動抽出
- キーワードベースの自動カテゴリ推定
- 信頼度スコア計算
- タグ自動生成

### 行動化機能

- ステータス管理 (未整理/要対応/保存済み/完了/アーカイブ)
- リマインダー設定
- お気に入り
- 行動リスト (期限ベース)

## プロジェクト構成

```
screenshot-inbox/
  ├── android/          # Capacitor Android プロジェクト
  ├── public/           # 静的アセット (PWA icon, manifest, SW)
  │   ├── favicon.svg   # SVG アイコン
  │   ├── icon-192.png  # PWA アイコン 192x192
  │   ├── icon-512.png  # PWA アイコン 512x512
  │   ├── manifest.json # PWA マニフェスト
  │   └── sw.js         # Service Worker
  ├── src/
  │   ├── components/   # 共通コンポーネント
  │   ├── pages/        # 各画面
  │   ├── store/        # Zustand ストア
  │   ├── types/        # TypeScript 型定義
  │   └── utils/        # OCR・画像処理・分析ロジック
  ├── capacitor.config.ts
  ├── vite.config.ts
  ├── tsconfig.json
  └── package.json
```

## アイコン・スプラッシュ

- **Source**: `public/favicon.svg` (SVGベクター)
- **PWA**: `public/icon-192.png`, `public/icon-512.png`
- **Android**: `android/app/src/main/res/mipmap-*/` 各解像度
- **スプラッシュ**: `android/app/src/main/res/drawable-*/splash.png`

アイコン再生成:
```bash
node generate-icons.js          # PWA 用
node generate-android-icons.js  # Android 用
node generate-splash.js         # スプラッシュ用
```

## 今後の拡張候補

- Tesseract.js による実 OCR 処理
- Android ネイティブ OCR (ML Kit) 対応
- iOS プラットフォーム追加
- カメラ直接撮影対応
- プッシュ通知リマインダー
- エクスポート機能 (CSV/JSON)
- ダークモード
- 多言語対応

## zip に含まれる内容

- ソースコード (`src/`)
- 設定ファイル (vite, tsconfig, tailwind, capacitor)
- Android プロジェクト (`android/`)
- PWA アセット (`public/`)
- ブランドアセット生成スクリプト
- README

**注意**: `node_modules/` は含まれません。`npm install` で復元してください。

## 署名/リリースに向けて

- [ ] Android 署名鍵の生成
- [ ] `build.gradle` に署名設定追加
- [ ] リリース用アイコン差し替え (デザイナー作成)
- [ ] Google Play ストア掲載用スクリーンショット
- [ ] プライバシーポリシー作成

# NoteFrame

NoteFrame は、React + Vite + Tailwind CSS + Capacitor で構築した、Android 優先の縦画面メモアプリです。  
ホーム画面のスクリーンショット映えを最優先にしつつ、`npm run build`、`npx cap sync android`、`android/` の生成まで実施済みの構成にしています。

## アプリ概要

- アプリ名: `NoteFrame`
- Package Name: `com.noteframe.mobile`
- 目的: スクショ1枚で完成度が伝わる、オフライン中心のモバイルメモアプリ
- 保存方式: `@capacitor/preferences`
- 対象: Android 優先、縦画面固定

## 技術スタック

- React
- Vite
- TypeScript
- Tailwind CSS
- Capacitor
- `@capacitor/android`
- `@capacitor/preferences`
- `react-router-dom`
- `clsx`
- `lucide-react`
- `@capacitor/assets`

## TypeScript 固定ルール

このプロジェクトのアプリ実装は TypeScript 固定です。

- React コンポーネントは `.tsx`
- ロジックや設定は `.ts`
- `strict: true`
- `noImplicitAny: true`
- `.js` / `.jsx` のアプリソースは作成していません

補足:

- `dist/` には Vite が生成する JavaScript が出力されます
- `android/` には Capacitor の Android ネイティブファイルが生成されます

## 主な機能

- メモ作成 / 編集 / 削除
- メモ一覧
- ピン留め
- お気に入り
- カラー分類
- アーカイブ
- 検索
- 並び替え
- テーマ切替
- サンプルメモ再生成
- 全データ削除
- アプリ情報表示

## 画面

- `Home`
  - 2カラムのカード一覧
  - 検索
  - フィルタ
  - 並び替え
  - ピン留めセクション
  - FAB
- `Editor`
  - タイトル / 本文
  - カラー切替
  - ピン留め / お気に入り / アーカイブ
  - 保存
- `Archive`
  - アーカイブ一覧
  - 復元
  - 完全削除
- `Settings`
  - テーマ切替
  - 並び順設定
  - サンプルメモ再生成
  - 全データ削除
  - アプリ情報

## セットアップ

推奨環境:

- Node.js `20.18+` 推奨
- npm `10+` または `11+`
- Android Studio
- Android SDK

PowerShell で実行:

```powershell
npm install
```

## 開発起動

```powershell
npm run dev
```

Vite の開発サーバーが起動します。

## ビルド

```powershell
npm run build
```

このコマンドで `dist/` が生成されます。

## Capacitor 導入済みについて

このリポジトリには以下が反映済みです。

- `capacitor.config.ts` 作成済み
- `@capacitor/core` / `@capacitor/cli` / `@capacitor/android` / `@capacitor/preferences` 導入済み
- `android/` 生成済み
- `com.noteframe.mobile` に統一済み

## Android プロジェクト生成済み

このプロジェクトはすでに `android/` ディレクトリを含んでいます。  
通常利用では `npx cap add android` を打ち直す必要はありません。

もし `android/` を削除して再生成する場合だけ、以下を使います。

```powershell
npx cap add android
```

## Android 同期手順

必ず `build → sync → open` の順で進めてください。

### 推奨コマンド

```powershell
npm run android:sync
```

これは内部で以下を実行します。

```powershell
npm run build
npx cap sync android
```

### 直接実行する場合

```powershell
npm run build
npx cap sync android
```

## Android Studio の開き方

Android Studio がインストールされている前提で、PowerShell から次を実行します。

```powershell
npm run android:open
```

内部では次を呼びます。

```powershell
npx cap open android
```

または Android Studio 側で `C:\Users\kouta\OneDrive\appi\android` を直接開いても大丈夫です。

## Android Studio での確認手順

1. `C:\Users\kouta\OneDrive\appi\android` を Android Studio で開く
2. 初回は Gradle Sync が走るのを待つ
3. 必要なら Android SDK の不足コンポーネントをインストールする
4. エミュレータまたは実機を選ぶ
5. Run で起動する

## APK 作成までの入口

Android Studio で `android/` を開いたあと、基本導線は次のとおりです。

1. `Build`
2. `Build Bundle(s) / APK(s)`
3. `Build APK(s)`

Debug APK の確認先の例:

- `android/app/build/outputs/apk/debug/`

Release APK / AAB を出す場合は、Android Studio 側で署名設定を追加してください。

## アイコン / スプラッシュ

元画像はルートの `assets/` に置いてあります。

- `assets/icon-only.png`
- `assets/icon-foreground.png`
- `assets/icon-background.png`
- `assets/splash.png`

生成済みの反映先:

- Android アイコン: `android/app/src/main/res/mipmap-*`
- Android スプラッシュ: `android/app/src/main/res/drawable*`
- PWA アイコン: `public/icons/`
- Manifest: `public/manifest.webmanifest`

### 差し替え手順

1. `assets/` 内の元画像を差し替える
2. 次を実行する

```powershell
npx @capacitor/assets generate --android --pwa --assetPath assets
```

3. 続けて Android へ同期する

```powershell
npm run android:sync
```

## package name / app name を変更する場所

変更ポイントは以下です。

- `capacitor.config.ts`
- `src/app/constants.ts`
- `android/app/build.gradle`
- `android/app/src/main/res/values/strings.xml`
- `public/manifest.webmanifest`

## 初回セットアップ順

PowerShell 前提のおすすめ順です。

```powershell
npm install
npm run build
npm run android:sync
npm run android:open
```

## よくある詰まりポイント

- `npm run build` の前に `npx cap sync android` を打つ
  - 古い `dist/` が同期されるので、先に build してください
- Android Studio が未インストール
  - `npm run android:open` は Android Studio が必要です
- Android SDK 未設定
  - Android Studio 起動後に SDK を案内されることがあります
- OneDrive / ウイルス対策ソフトで同期ファイルがロックされる
  - `npx cap sync android` 中にファイルロックが起きたら、Android Studio やエクスプローラーのプレビューを閉じて再実行してください
- `android/` を削除してしまった
  - `npx cap add android` のあとで `npm run android:sync` を実行してください

## 実行コマンド一覧

```powershell
npm install
npm run dev
npm run build
npm run android:sync
npm run android:open
```

## ディレクトリの見どころ

- `src/app/` アプリ全体のルーティングと定数
- `src/components/` 共通 UI
- `src/features/notes/` 型、保存処理、デモデータ、ノート UI、ロジック
- `src/pages/` 各画面
- `assets/` アイコン / スプラッシュ元画像
- `android/` Capacitor が生成した Android プロジェクト

## 補足

- 保存は `@capacitor/preferences` を使っているため、バックエンドなしで動作します
- 初回起動時には見栄え用の日本語サンプルメモを投入します
- Settings からサンプルメモ再生成と全削除が可能です

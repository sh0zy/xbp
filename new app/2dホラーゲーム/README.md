# 23:58 Campus

深夜の大学に戻った主人公が、記録から消された「欠席者」の名前を探す2D探索ホラーゲームです。React + Vite + TypeScript + Tailwind CSS + Capacitorで実装しています。

## ゲーム概要

- ジャンル：2D探索ホラー / 謎解き / ログ収集 / 軽い追跡・ステルス / マルチエンディング
- 舞台：23:58で止まった深夜の大学キャンパス
- 表現：CSS / SVG / タイルベースの2Dマップ、Web Audio APIによる自動生成音声
- セーブ：localStorage、最大3スロット
- 対応：スマホ縦画面、PCキーボード操作、PWA、Capacitor Android

## 操作方法

PC:

- WASD / 矢印キー：移動
- E / Enter：調べる
- Shift：走る
- Esc：メニュー / 会話スキップ
- M：ログ
- I：アイテム

スマホ:

- 左下の方向パッド：移動
- 右下の「調べる」：調査 / 決定
- 右下の「走る」：押している間、走行
- 下部タブ：記録 / 持ち物
- 右上メニュー：ポーズ

## 音声について

外部音声ファイルは使わず、Web Audio APIで以下を生成しています。

- タイトル / 校舎 / 図書館 / 管理棟 / 地下 / Finalの環境音
- 足音、調査音、ログ取得音、扉、PC起動音、ノイズ、怪異接近、追跡BGM、セーブ音、エンディングBGM
- ブラウザ制約に合わせ、タイトルのSTART / CONTINUE / SETTINGS操作後にAudioContextを初期化します。
- BGM音量、SE音量、音声ON/OFF、ノイズ演出ON/OFF、テキスト速度は設定画面から変更できます。

## セーブについて

localStorageに以下を保存します。

- currentChapter
- currentMap
- playerPosition
- collectedLogs
- inventory
- solvedPuzzles
- choices
- endingFlags
- audioSettings
- clearedEndings

セーブスロットは最大3つです。Ending B到達後はセーブ名が「042」に変化します。

## 実装済みChapter

- Prologue：大学正門前 / 夜の通学路
- Chapter 1：1号館廊下 / 講義室A / PC室 / 階段前 / 図書館入口
- Chapter 2：図書館ロビー / 書架エリア / 閲覧席 / 返却ポスト / 地下資料室入口
- Chapter 3：学生課前 / 事務室 / 保管庫 / 防犯カメラ室 / 職員用廊下
- Chapter 4：地下通路 / 記録保管室 / 古い掲示板 / 停電した資料室 / 非常階段
- Final：屋上前 / 屋上 / 23:58の教室 / 記録の中の廊下

## エンディング条件

- Ending A「帰宅」：ログ不足のまま最後の名前を正しく入力する
- Ending B「再出席」：最後の名前を間違える
- Ending C「欠席者の名前」：重要ログを集め、正しい名前「榊ユウ」を入力する

## 開発コマンド

```bash
npm install
npm run dev
npm run build
npx cap add android
npx cap sync android
```

Android Studioを開く直前まで完了しています。

次に行うコマンド：

```bash
npx cap open android
```

## Android設定

- appId：`com.kouta.horror2358campus`
- appName：`23:58 Campus`
- webDir：`dist`
- Android platform：追加済み
- `npx cap sync android`：成功確認済み
- `npx cap open android`：未実行

## PWA

- `public/manifest.webmanifest` 作成済み
- `display: standalone`
- `theme_color: #05050F`
- `background_color: #05050F`
- SVG仮アイコン：`public/icons/icon-192.svg`, `public/icons/icon-512.svg`

## 本番配布前チェックリスト

- アイコン確認
- スプラッシュ確認
- アプリ名確認
- パッケージ名確認
- Android実機確認
- 音声再生確認
- セーブ確認
- 画面崩れ確認

本番配布前にアイコン確認が必要です。

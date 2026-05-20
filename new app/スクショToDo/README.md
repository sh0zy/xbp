# スクショToDo (LaterFlow)

## アプリ概要
LaterFlowは、大学生・就活生・資格勉強中の人向けに、保存した情報を行動に変えるローカル管理アプリ。
画面上の表示名・Android Studio上のアプリ名は「スクショToDo」。

- 内部コード名: LaterFlow
- packageName / appId: `com.kouta.laterflow`
- localStorage key: `laterflow-app-state-v1`

## 解決する課題
- 保存した情報を見返せない
- 課題、就活、買い物、URL、メモが混ざる
- あとで見るつもりが忘れる
- 情報が行動につながらない

スクショToDoは、保存した情報を
「見る → 整理する → 行動に変える」流れに変換します。

- 今日やる / 今週やる / 調べる / 買う / 返信する / 忘れてよい / アーカイブ
  の7つの行動ステータスに振り分け
- 3分処理モードで、未整理情報を高速で片付け
- カテゴリ（授業・就活・資格・買い物・行きたい場所・アイデア・人間関係・その他）で整理
- 端末ローカルのみに保存、外部送信なし

## セットアップ

```bash
npm install
npm run dev
npm run build
```

## Capacitor

```bash
npx cap add android
npx cap sync android
npx cap open android
```

初回のみ `npx cap add android` を実行してください。
以降はビルド後に `npx cap sync android` を実行し、Android Studioで開きます。

## Netlify デプロイ

- build command: `npm run build`
- publish directory: `dist`
- Node version: 18 以上

手順:
1. `npm run build` でビルド
2. `dist` フォルダをNetlifyにドラッグ＆ドロップ、またはGit連携

## アイコン確認

以下の配置場所にアイコンが存在します:

- `public/icon-192.png`
- `public/icon-512.png`
- `public/favicon.png`
- `resources/icon.png`
- `resources/splash.png`

### 仮アイコンの差し替え

現状のアイコンはPowerShellで自動生成された仮デザインです。
本番配布前に、以下のサイズで差し替えてください。

- `public/icon-192.png` : 192×192 PNG
- `public/icon-512.png` : 512×512 PNG
- `public/favicon.png` : 64×64 PNG
- `resources/icon.png` : 1024×1024 PNG（Capacitorアイコン元画像）
- `resources/splash.png` : 2732×2732 PNG（スプラッシュ元画像）

Capacitor Assets プラグインを使ってランチャー/スプラッシュを一括生成する場合:

```bash
npm i -D @capacitor/assets
npx capacitor-assets generate --android
```

### PWAアイコン確認方法
1. `npm run build`
2. `npm run dev`（または `npm run preview`）
3. Chrome DevTools > Application > Manifest でアイコン・名称を確認
4. スマホでChromeから開き、「ホーム画面に追加」→「スクショToDo」アイコンが表示されることを確認

### Androidランチャーアイコン確認方法
1. `npm run build`
2. `npx cap sync android`
3. `npx cap open android`
4. Android Studio でエミュレーター or 実機にビルド
5. ホーム画面のアプリ一覧に「スクショToDo」のアイコンが表示されることを確認

## 主な画面
- Home: 今日やるべき情報 / 未整理数 / 期限が近い情報 / 最近追加
- Inbox: 検索・カテゴリ・状態・優先度フィルター
- Add: 手入力（タイトル・内容・カテゴリ・優先度・期限・メモ・URL・画像添付風UI）
- Process: 3分処理モード（今日やる・今週やる・消す・あとで・アーカイブ）
- Insights: 未整理数・今日やる・今週やる・アーカイブ・今週整理した数
- Settings: データ初期化 / サンプル復元 / 画像アクセス未使用の説明

## Google Play公開前の注意

- 「Screenshot Inbox」「スクリーンショットインボックス」という名称は使わない
- 既存アプリと似たアイコン・説明文・配色にしない
- 初期版では画像アクセス権限を使わない（リスク低減）
- 画像機能を追加する場合は、必要最小限の権限に絞り、プライバシーポリシーを必ず用意する
- スクショには個人情報が含まれ得るため、画像を扱う場合の取り扱いは特に慎重に
- ストア説明では「スクショ整理」ではなく **「保存情報の行動化」** を前面に出す

## ライセンス / 備考
- 本アプリはローカル動作のみで、外部API・外部送信なし
- 初回起動時にサンプルデータが投入されます（設定から削除・復元可能）

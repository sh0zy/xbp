# Not Today

**衝動買いを「待てる」アプリ**

欲しいと思ったら、まず登録。設定した待機時間が過ぎてから、冷静に判断する。
それだけのシンプルな仕組みで、衝動買いを自然に減らします。

## コンセプト

- 「我慢しろ」ではなく「ちょっと待ってみよう」
- 待機後に判定 → 見送りなら「買わずに済んだ金額」として可視化
- 自分の買い方のクセが見えてくる

## 画面構成

| 画面 | 概要 |
|------|------|
| オンボーディング | アプリ説明 → ニックネーム入力 |
| ホーム | 待機中アイテム、判定可能通知、セーブ金額 |
| アイテム登録 | 名前・価格・カテゴリ・流入元・理由を入力 |
| アイテム詳細 | 残り時間、判定ボタン（見送り / 購入） |
| 履歴 | 全アイテム一覧（フィルタ付き） |
| 分析 | セーブ金額、見送り率、カテゴリ別、7日トレンド |
| 設定 | ニックネーム、待機時間、データ管理 |

## 技術スタック

| 技術 | バージョン |
|------|-----------|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | v4 |
| Zustand | 5 |
| Recharts | 3 |
| React Router | 7 |
| Capacitor | 8 |
| vite-plugin-pwa | 1.2 |
| lucide-react | icons |

## セットアップ

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## Android ビルド

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## データ保存

- すべてのデータはローカルストレージに保存
- 外部サーバーへの送信なし
- `localStorage` キー: `not_today_data`

## プロジェクト構造

```
src/
  types/index.ts       - 型定義・ラベル
  store/index.ts       - Zustand ストア
  utils/
    storage.ts         - localStorage 永続化
    analysis.ts        - 統計・分析ロジック
  components/
    Card.tsx            - 共通カードコンポーネント
    BottomNav.tsx       - ボトムナビゲーション
  pages/
    Onboarding.tsx      - オンボーディング
    Home.tsx            - ホーム画面
    AddItem.tsx         - アイテム登録
    ItemDetail.tsx      - アイテム詳細・判定
    History.tsx         - 履歴一覧
    Analytics.tsx       - 分析画面
    SettingsPage.tsx    - 設定画面
```

## リリースチェックリスト

- [ ] Android 署名（keystore 作成 → Build > Generate Signed Bundle）
- [ ] アイコン本格デザイン差し替え（`public/icons/`, `public/favicon.svg`）
- [ ] Google Play 提出
- [ ] 通知機能の追加（待機完了通知）

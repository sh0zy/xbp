# ケシバト — Claude Code 作業ガイド

放課後装備戦ゲーム。React + Vite + Zustand + Tailwind + Capacitor(Android) 構成。

## スタック
- React 18 / TypeScript 5.6（strict, noUnusedLocals, noUnusedParameters）
- Vite 5
- Zustand 4（`src/hooks/useGameStore.ts` に単一ストア）
- Tailwind 3（設定: `tailwind.config.js`）
- Capacitor 8（Android のみ。`android/` 配下に Gradle プロジェクト）

## 必ず守ること

### 型・コード品質
- ファイル編集後は `npm run typecheck` を通す。落ちたら報告し、直してから完了宣言する。
- `any` は使わない。必要なら `unknown` + narrowing か、既存の `src/types/index.ts` を拡張する。
- `noUnusedLocals` / `noUnusedParameters` が有効。未使用の import・引数は必ず消す（`_name` のような回避表記も避ける）。

### エクスポート規約
- `src/components/` / `src/screens/` / `src/hooks/` / `src/utils/` は **named export**。
- `src/App.tsx` のみ `default export`（エントリなので例外）。

### スタイル規約
- CSS/SCSS ファイルは追加しない。Tailwind のみ。
- 使う色は `tailwind.config.js` に定義済みのものを優先：
  - `board` / `boardEdge` / `p1` / `p2` / `accent` / `ink` / `chalk`
  - 透明度は `bg-accent/40` 形式で。
- `tailwind.config.js` を**勝手に変更しない**（新色・新アニメーション追加時はユーザー確認）。
- タップ可能要素は `active:scale-95 transition` を基本に。角丸は `rounded-2xl` か `rounded-xl`。

### 状態管理
- 状態は `useGameStore` に集約。画面間で共有しない一時状態だけ `useState` を使う。
- 永続化が必要な値は `src/utils/storage.ts` の `SaveData` に追加し、`DEFAULT_SAVE` にデフォルト値を入れる。
- `const KEY = 'keshibato:v1'` を変更しない（既存セーブ破壊）。破壊的変更が必要なら `saveVersion` で migration を書く。

### 画面の追加
- `src/screens/<Name>Screen.tsx` を作る。
- `useGameStore.ts` の `Screen` union type に名前を追加。
- `src/App.tsx` の switch に case を追加。
- 遷移は `setScreen('<name>')` を使う（router ライブラリは入れない）。

## やらないこと
- 新しい依存パッケージを勝手に追加しない。必要なら必ずユーザーに確認する。
- `package.json` の `scripts` を勝手に増やさない。
- ルーティングライブラリ（react-router 等）を入れない。現行の switch ルーティングを維持。
- `android/` 配下の Gradle 設定、`applicationId`、`versionCode`、`versionName` を勝手に変更しない。
- テスト・Lint ツール（Jest/Vitest/ESLint）を勝手に導入しない（未導入がプロジェクトの現状）。提案は可。

## よく使うコマンド
- `npm run dev` — 開発サーバ起動
- `npm run typecheck` — 型チェックのみ
- `npm run build` — 本番ビルド（dist/ 出力）
- `npx cap sync android` — Web 資産を Android プロジェクトへ同期
- `cd android && ./gradlew assembleDebug` — debug APK 生成

## 使えるスキル
`.claude/skills/` 配下：
- `/add-screen` — 新画面の追加（ルーティング登録込み）
- `/zustand-slice` — ストアフィールドの追加（永続化込み）
- `/capacitor-release` — APK ビルドの固定フロー
- `/component-tailwind` — コンポーネント雛形生成

## 出力フォーマット
- 日本語で応答する。
- 変更を加えたら「何を変えたか」を1〜2行で要約する。長い説明は求められてから。
- UI 変更を完了宣言する前に、`npm run dev` での目視確認が必要な場合は**明示的に伝える**（型だけ通っても UI は保証されない）。

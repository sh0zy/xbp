---
name: add-screen
description: ケシバトに新しい画面(Screen)を追加する。src/screens配下に新コンポーネントを作成し、App.tsxのルーティングとtypes/ScreenNameに登録するまでを自動化する。
---

# add-screen スキル

ユーザーから画面名（例: `shop`）を受け取り、以下を順に実行する。

## 手順

1. **ヒアリング**
   - 画面名（PascalCase 用）を確認。例: `ShopScreen`
   - 遷移元ボタンの設置が必要かを確認（必要なら HomeScreen に追記）。

2. **ファイル生成**
   `src/screens/<Name>Screen.tsx` を以下のテンプレートで作成：

   ```tsx
   import { Button } from '../components/Button';
   import { useGameStore } from '../hooks/useGameStore';

   export function <Name>Screen() {
     const setScreen = useGameStore((s) => s.setScreen);

     return (
       <div className="min-h-[100dvh] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-boardEdge via-board to-boardEdge">
         <div className="pt-8 text-center">
           <h1 className="text-4xl font-black text-accent drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
             <Name>
           </h1>
         </div>
         <div className="w-full max-w-xs pb-8">
           <Button onClick={() => setScreen('home')}>もどる</Button>
         </div>
       </div>
     );
   }
   ```

3. **型への登録**
   `src/types/` 配下で `ScreenName`（またはそれに相当するunion型）を検索し、`'<name>'` を追加。

4. **ルーティング**
   `src/App.tsx` を開き、`screen === '<name>'` の分岐で `<<Name>Screen />` を返すよう追記。

5. **必要なら導線追加**
   HomeScreenに「<日本語ラベル> へ」ボタンを追加。既存ボタンと同じスタイルを踏襲する。

6. **検証**
   - `npm run typecheck` を走らせ、型エラーがないことを確認。
   - 失敗したら該当箇所を修正してから報告。

## 禁止事項
- Tailwindの設定（`tailwind.config.js`）は変更しない。色は既存の `accent` / `ink` / `board*` を使う。
- 新しい依存パッケージは追加しない。
- Zustandストアの形は壊さない。追加が必要な状態は `save` ではなく別のトップレベルフィールドに置く。

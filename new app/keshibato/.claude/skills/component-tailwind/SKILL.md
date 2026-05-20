---
name: component-tailwind
description: ケシバトのsrc/components/配下に、既存のスタイル規約（Button/HUDなど）に沿った新しいReactコンポーネントの雛形を生成する。Tailwindのプロジェクト独自色（accent, ink, board*）を使う。
---

# component-tailwind スキル

既存コンポーネント（[Button.tsx](src/components/Button.tsx) / [HUD.tsx](src/components/HUD.tsx) / [Piece.tsx](src/components/Piece.tsx) など）の書き方に合わせた新規コンポーネントを作る。

## 入力項目

1. **コンポーネント名**（PascalCase） 例: `ScoreBadge`
2. **Props の一覧**（名前と型） 例: `score: number, label?: string`
3. **子要素を受けるか**（`children?: ReactNode`）
4. **クリック可能か**（クリック可能ならボタン系テンプレート／そうでなければ表示系）

## 生成規約

- ファイル: `src/components/<Name>.tsx`
- `export function <Name>(...)` の **named export** を使う。`default export` は避ける（プロジェクトの他ファイルがそうなっている）。
- Props は `interface Props { ... }`、`ReactNode` 等の型は `import type { ReactNode } from 'react'`。
- className は Tailwind のみ。CSS ファイルは追加しない。
- 色は `tailwind.config.js` に定義されている以下を優先して使う：
  - `accent`（ハイライト）
  - `ink` / `ink/80` / `ink/20`（テキスト・境界）
  - `board` / `boardEdge`（背景）
  - `p1` / `p2`（プレイヤー色）
- 角丸は `rounded-2xl` か `rounded-xl`、タップ感は `active:scale-95 transition`。
- テキストの強調は `font-black tracking-wide` か `font-bold`。

## テンプレート（表示系）

```tsx
import type { ReactNode } from 'react';

interface Props {
  // ここに props
  children?: ReactNode;
  className?: string;
}

export function <Name>({ children, className = '' }: Props) {
  return (
    <div className={`rounded-2xl bg-board text-ink px-4 py-2 ${className}`}>
      {children}
    </div>
  );
}
```

## テンプレート（クリック系）
Button.tsx をそのままコピーせず、役割が違うならプリミティブとして新規に書く。ただし**色・角丸・active:scale-95** の3要素は必ず踏襲する。

## 禁止事項

- `tailwind.config.js` に新色を追加しない（スキル単体で完結させる）。必要なら既存色の opacity バリアント（例: `bg-accent/40`）を使う。
- インラインスタイル (`style={{ ... }}`) を使わない。動的値が必要な場合のみ例外。
- `any` 型を props に使わない。
- ライフサイクル・副作用（`useEffect`）を持ち込まない。純粋な表示/イベント伝搬のみ。ロジックはフック側（`useGameStore` 等）に置く。

## 検証

- `npm run typecheck` を実行。
- 生成したコンポーネントを使うサンプル import 文（どの画面で使うか）を最後に提案する。実際の差し込みはユーザーの承認後に行う。

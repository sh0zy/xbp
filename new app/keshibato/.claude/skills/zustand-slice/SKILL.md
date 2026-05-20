---
name: zustand-slice
description: ケシバトのuseGameStoreに新しい状態フィールドとセッターを追加し、SaveDataへの永続化まで一気通貫で行う。名前・型・初期値を受け取って差分を生成する。
---

# zustand-slice スキル

`src/hooks/useGameStore.ts` / `src/utils/storage.ts` の構造に従って、新しい状態スライスを追加する。

## 入力項目（ヒアリング）

1. **フィールド名**（camelCase）例: `bgmVolume`
2. **型**（TypeScript）例: `number` / `'light' | 'dark'` / `string[]`
3. **初期値** 例: `0.7`
4. **永続化するか**（はい = SaveData に載せる / いいえ = ストアのみ）
5. **セッター名**（省略時は `set<Field>`）

## 手順

### A. ストアのみの場合
1. `useGameStore.ts` の `interface Store` に以下を追加：
   ```ts
   <field>: <Type>;
   <setter>: (v: <Type>) => void;
   ```
2. `initial` オブジェクトに `<field>: <default>,` を追加。
3. `create<Store>((set, get) => ({ ... }))` 内に：
   ```ts
   <setter>: (v) => set({ <field>: v }),
   ```

### B. 永続化ありの場合
1. `src/utils/storage.ts` の `SaveData` に `<field>?: <Type>;` を追加（既存フィールドと同じく optional を優先。必須にするならデフォルトマージ処理を `loadSave` に追記する必要あり）。
2. `DEFAULT_SAVE` に `<field>: <default>,` を追加。
3. `useGameStore.ts` 側では **専用セッターを作らず、既存の `setSave` を使う方針** を優先する：
   ```ts
   setSave((s) => ({ ...s, <field>: v }))
   ```
   ただし呼び出し箇所が多い／UIから直接触る場合は、薄いラッパーを Store に追加してもよい：
   ```ts
   <setter>: (v) => {
     set((st) => {
       const next = { ...st.save, <field>: v };
       saveSave(next);
       return { save: next };
     });
   },
   ```

### C. 検証
- `npm run typecheck` を必ず実行。
- `saveSave` を手動で呼ぶ新規セッターを追加した場合、既存の `setSave` 経由の保存と二重にならないこと。

## 禁止事項
- `KEY = 'keshibato:v1'` を勝手に変更しない（既存ユーザーのセーブが飛ぶ）。破壊的変更が必要なら `saveVersion` で migration を書く。
- 既存フィールドの型を狭めない（例: `number` → `0|1|2` のような narrowing）。増やす側の変更のみ安全。
- `initial` の読込元 `loadSave() ?? DEFAULT_SAVE` の順序を変えない。

## 出力
変更した3ファイル（useGameStore.ts / storage.ts / 呼び出し追加箇所）の差分を提示し、ユーザーが承認したら適用する。

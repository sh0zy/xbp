# ケシバト - 放課後装備戦

スマホ向けカジュアル対戦ゲーム。
消しピンに学校アイテムを装備して指で弾き、相手を場外に落とす。

## セットアップ

```bash
npm install
npm run dev      # ローカル開発 (Vite)
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド確認
```

## 技術スタック
- React 18 + Vite + TypeScript
- Tailwind CSS
- Zustand (軽量状態管理)
- SVG ベースの独自物理エンジン
- PWA (manifest.json / service worker)

## PWA
- `public/manifest.json`
- `public/sw.js`
- `public/icons/icon-192.svg`, `icon-512.svg`
- スマホのブラウザで「ホーム画面に追加」するとアプリ風に起動

## アイコン確認
1. `npm run build` 後に `dist/icons/` が生成されることを確認
2. スマホで開いて「ホーム画面に追加」
3. アイコン見切れや余白不自然がないか確認
4. Android化 (Capacitor) の際は `dist/` を `webDir` に指定

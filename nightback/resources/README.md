# resources/

配布向けアイコンとスプラッシュを置く場所。

- `icon.png` — 1024x1024 PNG（正方形、余白少なめ、角丸は不要）
- `splash.png` — 2732x2732 PNG（中央にロゴ、背景は深ダーク）

## Android に反映するには

```sh
npm install -D @capacitor/assets
npx capacitor-assets generate --android
npx cap sync android
```

未配置でも `npm run build` と `npx cap sync android` は通ります。
反映できるアイコンが無いときは、Android 既定のアイコンが使われます。

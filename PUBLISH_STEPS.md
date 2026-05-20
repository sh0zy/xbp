# PUBLISH_STEPS.md — 自主制作 8 アプリの公開手順（GitHub Pages 一択）

このリポジトリ（`xbp`）の `apps/<slug>/` に各アプリの **静的ファイル（dist）** が同梱されています。
配信は **このリポジトリ 1 つの GitHub Pages のみ**。個別リポジトリは作りません。ローカルサーバーも不要です。

公開 URL（リポジトリ名が `xbp` の場合）:

| アプリ | Web URL |
|---|---|
| Focus Recipe | `https://sh0zy.github.io/xbp/apps/focus-recipe/` |
| Not Today | `https://sh0zy.github.io/xbp/apps/not-today/` |
| NoteFrame | `https://sh0zy.github.io/xbp/apps/noteframe/` |
| TaskFlow | `https://sh0zy.github.io/xbp/apps/taskflow/` |
| 3-Minute Start | `https://sh0zy.github.io/xbp/apps/three-minute-start/` |
| ケシバト | `https://sh0zy.github.io/xbp/apps/keshibato/` |
| スクショToDo | `https://sh0zy.github.io/xbp/apps/screenshot-todo/` |
| English Quest RPG | `https://sh0zy.github.io/xbp/apps/english-quest-rpg/` |

自主制作一覧ページ: `https://sh0zy.github.io/xbp/jishu/`

---

## 1. 今すぐ公開するためのコマンド（PowerShell）

```powershell
cd c:\Users\kouta\mygit\xbp

# 1) 何が変わったか確認
git status

# 2) すべての変更を addd
git add -A

# 3) commit
git commit -m "Replace 自主制作 with 8 new apps and mirror dist under apps/"

# 4) push
git push
```

push 後、数十秒〜数分で GitHub Pages に反映されます。確認 URL: `https://sh0zy.github.io/xbp/jishu/`

---

## 2. GitHub Pages の設定確認（一度だけ）

GitHub の Web UI で:
1. リポジトリ `sh0zy/xbp` を開く
2. **Settings → Pages**
3. **Source** が「Deploy from a branch」、**Branch** が `main` / `/(root)` になっていれば OK
4. ルートに `.nojekyll` が既にあるので、`_` で始まるアセットも配信されます

---

## 3. アプリを修正した後の再ビルド & 反映

`new app/<アプリ名>/` のソースを直したら、以下の 1 コマンドで `apps/<slug>/` まで再生成できます:

```powershell
cd c:\Users\kouta\mygit\xbp
.\scripts\rebuild-apps.ps1
```

このスクリプトは:
- `new app/` 配下の 8 アプリすべてを `npm run build`
- 生成された `dist/` を `apps/<slug>/` にコピー

ビルド後に `git add -A; git commit -m "rebuild apps"; git push` すれば公開反映されます。

1 アプリだけ反映したい場合（例: focus-recipe）:

```powershell
cd "c:\Users\kouta\mygit\xbp\new app\focus-recipe"
npm run build

$dest = "c:\Users\kouta\mygit\xbp\apps\focus-recipe"
Remove-Item -Recurse -Force $dest
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Recurse -Force "c:\Users\kouta\mygit\xbp\new app\focus-recipe\dist\*" $dest

cd c:\Users\kouta\mygit\xbp
git add apps/focus-recipe
git commit -m "rebuild focus-recipe"
git push
```

---

## 4. APK ビルド（Capacitor + Android Studio）

Web 公開と並行して APK 配布したい場合のみ。各アプリは Capacitor 設定済みで、`new app/<アプリ>/android/` が用意されています（スクショToDo のみ未生成）。

```powershell
# 例: focus-recipe の APK を作る
cd "c:\Users\kouta\mygit\xbp\new app\focus-recipe"
npm run build
npx cap sync android        # dist を android/app/src/main/assets/public/ に反映
npx cap open android        # Android Studio が起動
```

Android Studio で:
1. Gradle 同期完了を待つ
2. `Build → Generate Signed Bundle / APK → APK`
3. 署名キーを選ぶ（focus-recipe には `fitforge-release.jks` が同梱）
4. `release` を選んで Build
5. 生成された `app-release.apk` を `xbp/<slug>.apk` にコピー
6. `jishu/script.js` の該当アプリの `apkUrl: null` を `apkUrl: "../<slug>.apk"` に書き換えて push

### スクショToDo を Android 化（最初の1回のみ）

```powershell
cd "c:\Users\kouta\mygit\xbp\new app\スクショToDo"
npx cap add android
npx cap sync android
npx cap open android
```

`AndroidManifest.xml` / `ic_stat_notify.xml` がプロジェクト直下にあるので、生成された `android/app/src/main/` 配下と差分を確認して反映してください（通知アイコンなど）。

---

## 5. PWA / 「ホーム画面に追加」

各アプリは `dist/manifest.webmanifest`（または `manifest.json`）を含んでおり、GitHub Pages は HTTPS なので Android Chrome から「ホーム画面に追加」できます。

うまく動かない場合の確認:
- Chrome DevTools → Application → Manifest にエラーがないか
- アイコン解像度 192×192 / 512×512 が含まれているか
- `start_url` が相対パス（`base: './'` 済みなので問題ないはず）

---

## 6. トラブルシュート

| 症状 | 確認すること |
|---|---|
| `https://sh0zy.github.io/xbp/jishu/` が 404 | Settings → Pages の Source が `main` / `/(root)` か |
| 真っ白なページ | DevTools Console で `/assets/...` が 404 → vite.config の `base: './'` が抜けてないか |
| アイコンが出ない | `images/apps/<slug>.png` が存在するか・jishu/script.js の `icon:` パスを確認 |
| カード一覧が空 | DevTools Network で `script.js` が 200 か |
| Capacitor sync 失敗 | `npm run build` が成功しているか・`capacitor.config.ts` の `webDir: 'dist'` を確認 |

---

## 7. ロールバック

`xbp/backup-before-new-app-replace/` に旧ファイルのコピーがあります。戻したい場合:

```powershell
$bk = "c:\Users\kouta\mygit\xbp\backup-before-new-app-replace"
Copy-Item -Force "$bk\jishu\index.html"  "c:\Users\kouta\mygit\xbp\jishu\index.html"
Copy-Item -Force "$bk\jishu\script.js"   "c:\Users\kouta\mygit\xbp\jishu\script.js"
Copy-Item -Force "$bk\root\index.html"   "c:\Users\kouta\mygit\xbp\index.html"
```

---

## 8. 次に打つコマンド（最短ルート）

```powershell
cd c:\Users\kouta\mygit\xbp

# 状態確認
git status

# 全部 add → commit → push（GitHub Pages に公開）
git add -A
git commit -m "Replace 自主制作 with 8 new apps under apps/"
git push

# 数分待ってから:
# https://sh0zy.github.io/xbp/jishu/  を開いて 8 枚のカードを確認
# 各カードの「Webアプリを開く」をタップして動作確認
```

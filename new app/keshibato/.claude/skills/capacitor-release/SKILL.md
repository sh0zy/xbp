---
name: capacitor-release
description: ケシバトのAndroid APKビルド手順を固定化する。Web資産ビルド → Capacitor同期 → Gradleでdebug/release APKを生成するまでを順番に実行し、失敗時は原因の切り分けまで行う。
---

# capacitor-release スキル

`npm run build` → `npx cap sync android` → Gradle ビルドの一連の流れを一気に通す。

## 前提チェック（最初に確認）

- `capacitor.config.ts` が存在すること
- `android/` ディレクトリが存在すること
- `android/local.properties` に `sdk.dir=...` が書かれていること（Android SDK のパス）
- リリースAPKを作る場合は `android/keystore.properties` などで署名情報が用意されていること（未設定なら debug のみ作る）

どれか欠けていたらユーザーに報告して停止する。勝手に `npx cap add android` は**しない**（既存プロジェクトを上書きしうる）。

## 引数

- `debug`（既定）: `assembleDebug` だけ走らせる
- `release`: `assembleRelease` を走らせる（署名が必要）

## 手順

1. **Web 資産をビルド**
   ```
   npm run build
   ```
   → `dist/` が更新される。TypeScript/Viteのエラーがあればここで落ちる。落ちたら Gradle には進まない。

2. **Capacitor 同期**
   ```
   npx cap sync android
   ```
   → `dist/` を `android/app/src/main/assets/public` へコピーし、ネイティブプラグインを反映。

3. **Gradle ビルド**
   - Windows 前提。`cd android && ./gradlew assembleDebug`（or `assembleRelease`）を実行。
   - 初回はダウンロードで長くなるため timeout を 600000ms に設定する。
   - 出力先:
     - debug → `android/app/build/outputs/apk/debug/app-debug.apk`
     - release → `android/app/build/outputs/apk/release/app-release.apk`（または `-unsigned.apk`）

4. **結果の提示**
   APK のフルパスと、`ls -la` で得たサイズ・更新日時を表示する。

## 失敗時の切り分け

| 症状 | 対応 |
|---|---|
| `npm run build` で TSエラー | ファイル行を特定して報告。勝手に修正せず、ユーザーに確認を取る |
| `cap sync` で plugin 不整合 | `node_modules` を再インストールする前に、まず `npx cap doctor` を実行して報告 |
| Gradle で `SDK location not found` | `android/local.properties` の `sdk.dir` 欠落。ユーザーに提示 |
| Gradle で `Keystore file not found` | release 署名未設定。debug でのやり直しを提案 |
| `JAVA_HOME` 系エラー | JDK 17 が要る。現在の `java -version` を確認して報告 |

## 禁止事項
- `android/app/build.gradle` の `applicationId` / `versionCode` / `versionName` を**勝手に**変更しない。変更が必要ならユーザーに確認する。
- `gradlew clean` を勝手に実行しない（キャッシュ破棄はビルド時間が跳ねる）。明示要求時のみ。
- 署名鍵ファイル（`*.jks`, `*.keystore`）をコミット候補に含めない。

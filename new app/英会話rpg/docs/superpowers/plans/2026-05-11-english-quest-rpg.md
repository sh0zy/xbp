# English Quest RPG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first React, Vite, TypeScript, Tailwind CSS, and Capacitor English conversation RPG that runs in the browser and can be opened from Android Studio.

**Architecture:** `App.tsx` owns screen navigation and persisted player/settings state. Data files define stages, enemies, and equipment; utility files isolate storage, rule scoring, OpenAI Responses API scoring, and Web Speech API wrappers. Components render home, map, battle, settings, stats, equipment, tutorial, and modal flows.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Capacitor Android, Web Speech API, localStorage, OpenAI Responses API, PWA manifest/service worker.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `capacitor.config.ts`
- Create: `src/main.tsx`
- Create: `src/index.css`

- [x] Add React/Vite/TypeScript/Tailwind/Capacitor dependencies and scripts.
- [x] Configure Capacitor with app name `English Quest RPG`, app id `com.kota.englishquestrpg`, and `webDir: "dist"`.
- [x] Add mobile viewport metadata, PWA manifest link, and theme color.

### Task 2: Game Domain and Persistence

**Files:**
- Create: `src/types.ts`
- Create: `src/data/stages.ts`
- Create: `src/data/enemies.ts`
- Create: `src/data/equipment.ts`
- Create: `src/utils/storage.ts`

- [x] Define typed player, stage, enemy, equipment, settings, and evaluation models.
- [x] Add all 50 stages with required word counts, missions, hints, rewards, and boss flags.
- [x] Add all required normal and boss enemies with questions and battle copy.
- [x] Add localStorage loading, saving, reset, and settings helpers with API-key-safe behavior.

### Task 3: Evaluation, AI, and Speech

**Files:**
- Create: `src/utils/evaluateEnglish.ts`
- Create: `src/utils/openaiClient.ts`
- Create: `src/utils/speech.ts`

- [x] Implement rule-based scoring for word count, relevance, conversation phrases, reasoning phrases, Japanese text ratio, repetition, and stage difficulty.
- [x] Implement OpenAI Responses API scoring only when AI scoring is enabled and a user-provided key exists.
- [x] Fall back to rule scoring on missing key, disabled AI, or API errors.
- [x] Wrap Web Speech API with availability detection and friendly error handling.

### Task 4: Screens and Game Flow

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/HomeScreen.tsx`
- Create: `src/components/StageMap.tsx`
- Create: `src/components/BattleScreen.tsx`
- Create: `src/components/SettingsScreen.tsx`
- Create: `src/components/StatsScreen.tsx`
- Create: `src/components/VoiceInputButton.tsx`
- Create: `src/components/ResultModal.tsx`
- Create: `src/components/LevelUpModal.tsx`
- Create: `src/components/BossIntro.tsx`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/EquipmentScreen.tsx`
- Create: `src/components/TutorialScreen.tsx`

- [x] Implement title, tutorial, home, map, battle, equipment, stats, and settings navigation.
- [x] Implement turn-based battle, damage calculation, rank and element animations, combo, victory, defeat, rewards, level up, and boss intro flows.
- [x] Implement settings controls for API key, save toggle, AI scoring toggle, model name, connection test, and key deletion.

### Task 5: PWA, Icons, Android, Verification

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Create: `public/offline.html`
- Create: `resources/icon.png`
- Create: `resources/splash.png`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`

- [x] Add offline fallback and installable app metadata.
- [x] Create matching app/PWA icon resources.
- [x] Run `npm install`.
- [x] Run `npm run build`.
- [x] Run `npx cap add android` if the Android platform does not exist yet.
- [x] Run `npx cap sync android`.
- [x] Generate or verify Capacitor Android launcher icons from `resources/icon.png`.

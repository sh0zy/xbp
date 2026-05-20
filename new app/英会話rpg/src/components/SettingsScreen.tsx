import { CheckCircle2, KeyRound, Loader2, SlidersHorizontal, Trash2, Wifi } from "lucide-react";
import { useState } from "react";
import { getDifficultyConfig } from "../data/difficulty";
import type { PlayerData } from "../types";
import { testOpenAIConnection } from "../utils/openaiClient";

const normalizeModelInput = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "gpt5.4") {
    return "gpt-5.4";
  }
  return value;
};

export default function SettingsScreen({
  player,
  onChange,
  onReset,
  onOpenLevelSelect,
}: {
  player: PlayerData;
  onChange: (player: PlayerData) => void;
  onReset: () => void;
  onOpenLevelSelect: () => void;
}) {
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const difficulty = getDifficultyConfig(player.englishLevel);

  const updateSettings = (settings: Partial<PlayerData["settings"]>) => {
    onChange({
      ...player,
      settings: {
        ...player.settings,
        ...settings,
      },
    });
  };

  const handleTest = async () => {
    setTesting(true);
    setTestMessage("");
    const result = await testOpenAIConnection(player.settings.apiKey ?? "", player.settings.model);
    setTestMessage(result.message);
    setTesting(false);
  };

  return (
    <main className="safe-screen space-y-5">
      <header className="rpg-dialogue p-4">
        <p className="rpg-small-label text-xs">Settings</p>
        <h1 className="rpg-title mt-1 text-2xl font-black">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-skyglass/90">
          Use your own OpenAI API key. API charges may apply. Be careful when saving keys on shared or public devices.
        </p>
      </header>

      <section className="rpg-window space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="rpg-small-label text-xs">English Level</p>
            <h2 className="mt-1 text-xl font-black text-white">{difficulty.label}</h2>
            <p className="mt-2 text-sm leading-6 text-skyglass/90">{difficulty.description}</p>
            <p className="mt-2 text-xs leading-5 text-amber">
              HP x{difficulty.enemyHpMultiplier} / Attack x{difficulty.enemyAttackMultiplier} / Words x{difficulty.requiredWordsMultiplier} / Strict x{difficulty.scoreStrictness}
            </p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded border-2 border-[#fff6d0] bg-black/35 text-amber">
            <SlidersHorizontal size={24} />
          </div>
        </div>
        {player.englishLevel === "C1" ? (
          <div className="rpg-dialogue border-coral p-3 text-xs leading-5 text-coral">
            C1は上級者向けです。敵が強くなり、長く自然な英語で答える必要があります。
          </div>
        ) : null}
        <button type="button" onClick={onOpenLevelSelect} className="rpg-command rpg-command-primary min-h-12 w-full px-4 font-black">
          レベル変更
        </button>
      </section>

      <section className="rpg-window space-y-4 p-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
            <KeyRound size={17} />
            OpenAI API Key
          </span>
          <input
            type="password"
            value={player.settings.apiKey ?? ""}
            autoComplete="off"
            onChange={(event) => updateSettings({ apiKey: event.target.value })}
            placeholder="sk-..."
            className="min-h-12 w-full rounded border-2 border-[#fff6d0] bg-[#fff6d0] px-4 text-black placeholder:text-black/45 outline-none transition focus:border-amber"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-white">Model</span>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              type="text"
              value={player.settings.model}
              onChange={(event) => updateSettings({ model: normalizeModelInput(event.target.value) })}
              onBlur={(event) => updateSettings({ model: normalizeModelInput(event.target.value) || "gpt-5.4" })}
              className="min-h-12 w-full rounded border-2 border-[#fff6d0] bg-[#fff6d0] px-4 text-black outline-none transition focus:border-amber"
            />
            <button type="button" onClick={() => updateSettings({ model: "gpt-5.4" })} className="rpg-command px-3 text-sm font-black">
              gpt-5.4
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-skyglass/85">Typing gpt5.4 is normalized to gpt-5.4 before API calls.</p>
        </label>

        <div className="grid gap-3">
          <label className="rpg-dialogue flex min-h-14 items-center justify-between px-4 py-3">
            <span>
              <span className="block text-sm font-black text-white">AI scoring</span>
              <span className="text-xs text-skyglass/85">Connects to the API only when enabled.</span>
            </span>
            <input
              type="checkbox"
              checked={player.settings.aiScoring}
              onChange={(event) => updateSettings({ aiScoring: event.target.checked })}
              className="h-6 w-6 accent-amber"
            />
          </label>

          <label className="rpg-dialogue flex min-h-14 items-center justify-between px-4 py-3">
            <span>
              <span className="block text-sm font-black text-white">Save API key</span>
              <span className="text-xs text-skyglass/85">When off, the key stays only in memory.</span>
            </span>
            <input
              type="checkbox"
              checked={player.settings.saveApiKey}
              onChange={(event) => updateSettings({ saveApiKey: event.target.checked })}
              className="h-6 w-6 accent-amber"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={handleTest} disabled={testing} className="rpg-command rpg-command-primary flex min-h-12 items-center justify-center gap-2 px-3 font-black">
            {testing ? <Loader2 className="animate-spin" size={18} /> : <Wifi size={18} />}
            Test
          </button>
          <button type="button" onClick={() => updateSettings({ apiKey: undefined, saveApiKey: false })} className="rpg-command flex min-h-12 items-center justify-center gap-2 px-3 font-black text-coral">
            <Trash2 size={18} />
            Delete Key
          </button>
        </div>

        {testMessage ? (
          <div className="rpg-dialogue flex items-start gap-2 p-3 text-sm leading-6 text-skyglass/90">
            <CheckCircle2 className="mt-0.5 text-amber" size={18} />
            {testMessage}
          </div>
        ) : null}
      </section>

      <section className="rpg-window p-4">
        <h2 className="text-lg font-black text-white">Save Data</h2>
        <p className="mt-2 text-sm leading-6 text-skyglass/90">Progress is saved in localStorage on this device.</p>
        <button type="button" onClick={onReset} className="rpg-command mt-4 min-h-12 w-full font-black text-coral">
          Reset Adventure
        </button>
      </section>
    </main>
  );
}

import { AlertTriangle, Check, ChevronRight, Flame, Shield, Sparkles, Star } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { difficultyConfigs } from "../data/difficulty";
import type { EnglishLevel } from "../types";

const levelStars: Record<EnglishLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
};

const levelTone: Record<EnglishLevel, string> = {
  A1: "bg-mint text-ink",
  A2: "bg-amber text-ink",
  B1: "bg-[#fff6d0] text-ink",
  B2: "bg-coral text-white",
  C1: "bg-gradient-to-r from-[#3b175e] via-[#821b3d] to-[#d5a12a] text-white",
};

export default function LevelSelectScreen({
  currentLevel,
  onSelect,
  onCancel,
}: {
  currentLevel: EnglishLevel;
  onSelect: (level: EnglishLevel) => void;
  onCancel?: () => void;
}) {
  const [selected, setSelected] = useState<EnglishLevel>(currentLevel);
  const selectedConfig = difficultyConfigs.find((config) => config.level === selected) ?? difficultyConfigs[0];

  return (
    <main className={clsx("safe-screen space-y-4", selected === "C1" && "level-c1-mode")}>
      <header className="rpg-dialogue p-4">
        <p className="rpg-small-label text-xs">English Level</p>
        <h1 className="rpg-title mt-1 text-2xl font-black">あなたの英語レベルを選ぼう</h1>
        <p className="mt-2 text-sm leading-6 text-skyglass/90">後から設定で変更できます。進行状況はそのまま残ります。</p>
      </header>

      <section className="space-y-3">
        {difficultyConfigs.map((config) => {
          const active = selected === config.level;
          const isC1 = config.level === "C1";
          return (
            <button
              key={config.level}
              type="button"
              onClick={() => setSelected(config.level)}
              className={clsx(
                "level-card w-full p-4 text-left transition",
                active && "level-card-active",
                isC1 && "level-card-c1",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx("grid h-12 w-12 shrink-0 place-items-center rounded border-2 border-[#fff6d0]", levelTone[config.level])}>
                  {isC1 ? <Flame size={24} /> : <Shield size={23} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-white">{config.label}</h2>
                    {isC1 ? <span className="rounded border border-amber bg-black/40 px-2 py-1 text-[10px] font-black text-amber">Advanced Challenge</span> : null}
                    {active ? <Check className="text-mint" size={18} /> : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-skyglass/88">{config.description}</p>
                  <p className="mt-1 text-xs leading-5 text-skyglass/70">おすすめ対象: {config.target}</p>
                  <div className="mt-3 flex items-center gap-1 text-amber">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={14} fill={index < levelStars[config.level] ? "currentColor" : "none"} opacity={index < levelStars[config.level] ? 1 : 0.35} />
                    ))}
                    <span className="ml-2 text-xs font-black">{isC1 ? "Boss級" : `Difficulty ${levelStars[config.level]}/5`}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section className={clsx("rpg-window p-4", selected === "C1" && "border-coral")}>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded border border-[#fff6d0] bg-black/35 text-amber">
            {selected === "C1" ? <AlertTriangle size={21} /> : <Sparkles size={21} />}
          </div>
          <div>
            <p className="text-sm font-black text-white">{selectedConfig.label}</p>
            <p className="mt-1 text-sm leading-6 text-skyglass/85">{selectedConfig.motto}</p>
            <p className="mt-2 text-xs leading-5 text-amber">
              HP x{selectedConfig.enemyHpMultiplier} / Attack x{selectedConfig.enemyAttackMultiplier} / Words x{selectedConfig.requiredWordsMultiplier}
            </p>
            {selected === "C1" ? (
              <p className="mt-2 text-xs leading-5 text-coral">C1は上級者向けです。敵が強くなり、長く自然な英語で答える必要があります。</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <button type="button" onClick={() => onSelect(selected)} className="rpg-command rpg-command-primary flex min-h-14 w-full items-center justify-center gap-2 px-4 text-base font-black">
          このレベルで始める
          <ChevronRight size={20} />
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rpg-command min-h-12 w-full px-4 text-sm font-black">
            Settingsに戻る
          </button>
        ) : null}
      </div>
    </main>
  );
}

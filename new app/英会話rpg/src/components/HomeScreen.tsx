import { BookOpen, ChevronRight, Crown, Flame, Mic, ScrollText } from "lucide-react";
import { getAdjustedRequiredWords, getDifficultyConfig, getLeveledEnemyName } from "../data/difficulty";
import { getEnemyById } from "../data/enemies";
import { getStageById, stages } from "../data/stages";
import type { PlayerData } from "../types";

export default function HomeScreen({
  player,
  onStart,
  onOpenTutorial,
}: {
  player: PlayerData;
  onStart: (stageId: number) => void;
  onOpenTutorial: () => void;
}) {
  const stage = getStageById(player.currentStage);
  const enemy = getEnemyById(stage.enemyId);
  const difficulty = getDifficultyConfig(player.englishLevel);
  const requiredWords = getAdjustedRequiredWords(stage, player.englishLevel);
  const enemyName = getLeveledEnemyName(enemy, player.englishLevel);
  const cleared = player.clearedStages.length;
  const progress = Math.round((cleared / stages.length) * 100);

  return (
    <main className="safe-screen space-y-5">
      <section className="rpg-window p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rpg-nameplate">Hero Lv {player.level}</p>
            <h1 className="rpg-title mt-4 text-3xl font-black leading-tight">English Quest RPG</h1>
            <p className="mt-3 text-sm leading-6 text-white/90">Choose a stage, answer in English, and turn your sentence into a battle command.</p>
            <div className="mt-3 inline-flex rounded border border-amber bg-black/30 px-3 py-2 text-xs font-black text-amber">
              Current Level: {difficulty.label}
            </div>
            <p className="mt-2 text-sm leading-5 text-skyglass/85">{difficulty.motto}</p>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded border-2 border-[#fff6d0] bg-black/35 text-amber">
            <ScrollText size={30} />
          </div>
        </div>
      </section>

      <section className="rpg-window p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="rpg-small-label text-xs">Next Quest</p>
            <h2 className="mt-1 truncate text-xl font-black text-white">
              {stage.id}. {stage.name}
            </h2>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded border-2 border-[#fff6d0] bg-black/30 text-4xl" aria-hidden>
            {enemy.emoji}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rpg-dialogue p-2">
            <p className="text-[11px] text-amber">Theme</p>
            <p className="mt-1 truncate text-sm font-bold text-white">{stage.theme}</p>
          </div>
          <div className="rpg-dialogue p-2">
            <p className="text-[11px] text-amber">Words</p>
            <p className="mt-1 text-sm font-bold text-white">{requiredWords}+</p>
          </div>
          <div className="rpg-dialogue p-2">
            <p className="text-[11px] text-amber">Enemy</p>
            <p className="mt-1 truncate text-sm font-bold text-white">{enemyName}</p>
          </div>
        </div>

        <button type="button" onClick={() => onStart(stage.id)} className="rpg-command rpg-command-primary mt-4 flex min-h-14 w-full items-center justify-center gap-2 px-4 text-base font-black">
          <span className="rpg-menu-cursor">Fight with English</span>
          <ChevronRight size={20} />
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rpg-window p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded border border-[#fff6d0] bg-black/25 text-coral">
            <Flame size={20} />
          </div>
          <p className="text-2xl font-black text-white">{progress}%</p>
          <p className="text-sm text-skyglass/80">Quest Progress</p>
        </div>
        <div className="rpg-window p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded border border-[#fff6d0] bg-black/25 text-amber">
            <Crown size={20} />
          </div>
          <p className="text-2xl font-black text-white">{player.gold}</p>
          <p className="text-sm text-skyglass/80">Gold</p>
        </div>
      </section>

      <section className="rpg-dialogue p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded border border-[#fff6d0] bg-[#082e7e] text-amber">
            <Mic size={22} />
          </div>
          <div>
            <h3 className="font-black text-white">Voice Command Ready</h3>
            <p className="text-sm leading-5 text-skyglass/85">Speak or type. Both become your command.</p>
          </div>
        </div>
        <button type="button" onClick={onOpenTutorial} className="rpg-command mt-3 flex w-full items-center justify-center gap-2 px-3 py-3 text-sm font-bold">
          <BookOpen size={18} />
          Tutorial
        </button>
      </section>
    </main>
  );
}

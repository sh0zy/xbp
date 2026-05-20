import { Check, Lock, Swords } from "lucide-react";
import clsx from "clsx";
import { getAdjustedRequiredWords, getDifficultyConfig, getLeveledEnemyName } from "../data/difficulty";
import { getEnemyById } from "../data/enemies";
import { stages } from "../data/stages";
import type { PlayerData } from "../types";

export default function StageMap({ player, onSelect }: { player: PlayerData; onSelect: (stageId: number) => void }) {
  const clearedSet = new Set(player.clearedStages);
  const difficulty = getDifficultyConfig(player.englishLevel);

  return (
    <main className="safe-screen space-y-4">
      <header className="rpg-dialogue p-4">
        <p className="rpg-small-label text-xs">Stage Map</p>
        <h1 className="rpg-title mt-1 text-2xl font-black">50 English Gates</h1>
        <p className="mt-2 text-sm leading-6 text-skyglass/85">
          {difficulty.label}: {difficulty.motto}
        </p>
      </header>

      <div className="space-y-3">
        {stages.map((stage) => {
          const enemy = getEnemyById(stage.enemyId);
          const requiredWords = getAdjustedRequiredWords(stage, player.englishLevel);
          const enemyName = getLeveledEnemyName(enemy, player.englishLevel);
          const unlocked = stage.id <= player.currentStage;
          const cleared = clearedSet.has(stage.id);
          return (
            <button
              key={stage.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(stage.id)}
              className={clsx(
                "rpg-window w-full p-3 text-left transition",
                unlocked ? "opacity-100" : "opacity-50",
                stage.isBoss && unlocked ? "ring-2 ring-amber/50" : "",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "grid h-12 w-12 shrink-0 place-items-center rounded border-2 border-[#fff6d0] text-2xl",
                    stage.isBoss ? "bg-coral/25" : "bg-black/25",
                  )}
                >
                  {unlocked ? enemy.emoji : <Lock size={22} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="rpg-menu-cursor truncate text-sm font-black text-white">
                      {stage.id}. {stage.name}
                    </p>
                    {stage.isBoss ? <span className="rounded border border-coral bg-black/25 px-2 py-0.5 text-[10px] font-black text-coral">BOSS</span> : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-skyglass/85">{stage.theme}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-amber">
                    <span>{requiredWords}+ words</span>
                    <span>/</span>
                    <span>{enemyName}</span>
                  </div>
                </div>
                <div
                  className={clsx(
                    "grid h-9 w-9 shrink-0 place-items-center rounded border border-[#fff6d0]",
                    cleared ? "bg-[#7af0b6] text-ink" : unlocked ? "bg-black/25 text-white" : "bg-black/20 text-white/50",
                  )}
                >
                  {cleared ? <Check size={18} /> : <Swords size={17} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

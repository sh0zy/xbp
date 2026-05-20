import { Crown, Swords } from "lucide-react";
import type { Enemy, Stage } from "../types";

export default function BossIntro({ stage, enemy, enemyName, onClose }: { stage: Stage; enemy: Enemy; enemyName?: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/82 p-5">
      <section className="rpg-window w-full max-w-[380px] overflow-hidden p-0">
        <div className="border-b-2 border-[#fff6d0] bg-coral/20 px-5 py-3 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-black uppercase text-coral">
            <Crown size={18} />
            Boss Battle
          </p>
        </div>
        <div className="p-6 text-center">
          <div className="rpg-enemy-sprite mx-auto mb-4 grid h-28 w-28 place-items-center rounded border-2 border-[#fff6d0] bg-black/35 text-7xl">
            {enemy.emoji}
          </div>
          <p className="text-sm font-bold text-amber">Stage {stage.id}</p>
          <h2 className="rpg-title mt-1 text-3xl font-black">{enemyName ?? enemy.name}</h2>
          <p className="rpg-dialogue mt-4 p-3 text-sm leading-6 text-skyglass/90">{enemy.introMessage}</p>
          <button
            type="button"
            onClick={onClose}
            className="rpg-command mt-6 flex min-h-12 w-full items-center justify-center gap-2 px-4 font-black text-white"
          >
            <Swords size={18} />
            Face the Boss
          </button>
        </div>
      </section>
    </div>
  );
}

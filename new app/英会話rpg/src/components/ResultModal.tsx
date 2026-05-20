import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import type { EvaluationResult, Stage, StageReward } from "../types";

export default function ResultModal({
  didWin,
  didLose,
  damage,
  enemyAttack,
  evaluation,
  stage,
  reward,
  onContinue,
  onRetry,
}: {
  didWin: boolean;
  didLose: boolean;
  damage: number;
  enemyAttack: number;
  evaluation?: EvaluationResult;
  stage: Stage;
  reward: StageReward;
  onContinue: () => void;
  onRetry: () => void;
}) {
  if (!didWin && !didLose) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/72 p-3">
      <section className="rpg-window w-full max-w-[410px] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded border-2 border-[#fff6d0] bg-amber text-ink">
            <Sparkles size={25} />
          </div>
          <div>
            <p className="rpg-small-label text-xs">{didWin ? "Victory" : "Try Again"}</p>
            <h2 className="rpg-title text-2xl font-black">{didWin ? "Quest Cleared!" : "You can recover."}</h2>
          </div>
        </div>

        {evaluation ? (
          <div className="rpg-dialogue mt-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber">English Score</p>
                <p className="text-3xl font-black text-white">
                  {evaluation.score}
                  <span className="ml-2 text-lg text-amber">Rank {evaluation.rank}</span>
                </p>
              </div>
              <div className={`text-right text-3xl font-black element-${evaluation.element}`}>{damage}</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-skyglass/85">{evaluation.shortExplanationJa}</p>
            <p className="mt-3 rounded border border-white/20 bg-[#082e7e] p-3 text-sm leading-6 text-white">{evaluation.naturalExpression}</p>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rpg-dialogue p-3">
            <p className="text-[11px] text-skyglass/70">Damage</p>
            <p className="font-black text-white">{damage}</p>
          </div>
          <div className="rpg-dialogue p-3">
            <p className="text-[11px] text-skyglass/70">Counter</p>
            <p className="font-black text-white">{enemyAttack}</p>
          </div>
          <div className="rpg-dialogue p-3">
            <p className="text-[11px] text-skyglass/70">Stage</p>
            <p className="font-black text-white">{stage.id}</p>
          </div>
        </div>

        {didWin ? (
          <div className="rpg-dialogue mt-4 p-3">
            <p className="text-xs font-bold text-amber">Rewards</p>
            <p className="mt-1 text-sm text-white">
              EXP {reward.exp} / Gold {reward.gold} / Expression: {reward.expression}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          {didLose ? (
            <button
              type="button"
              onClick={onRetry}
              className="rpg-command flex min-h-12 flex-1 items-center justify-center gap-2 px-4 font-black text-white"
            >
              <RotateCcw size={18} />
              Retry
            </button>
          ) : null}
          <button
            type="button"
            onClick={onContinue}
            className="rpg-command rpg-command-primary flex min-h-12 flex-1 items-center justify-center gap-2 px-4 font-black"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

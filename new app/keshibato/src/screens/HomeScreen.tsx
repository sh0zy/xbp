import { Button } from '../components/Button';
import { useGameStore } from '../hooks/useGameStore';

export function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setMode = useGameStore((s) => s.setMode);
  const save = useGameStore((s) => s.save);

  const go = (target: Parameters<typeof setScreen>[0], mode?: 'solo' | 'duo' | 'practice' | 'challenge') => {
    if (mode) setMode(mode, 'normal');
    setScreen(target);
  };

  const soloStreak = save.cpuStreak?.solo?.current ?? 0;
  const rpgMax = save.rpg?.maxUnlockedStage ?? 0;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-boardEdge via-board to-boardEdge">
      <div className="pt-8 text-center">
        <h1 className="text-5xl font-black tracking-wider text-accent drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
          ケシバト
        </h1>
        <p className="mt-1 text-ink/70 text-sm">放課後装備戦</p>
        <p className="mt-4 text-ink/50 text-xs">勝利 {save.winCount} / 敗戦 {save.loseCount}</p>
        {soloStreak >= 2 && (
          <p className="mt-1 text-rose-400 text-[11px] font-bold">
            ⚠ CPU {soloStreak}連勝中(強化されています)
          </p>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* RPGモードは別枠で最上段に */}
        <button
          onClick={() => setScreen('rpgHome')}
          className="rounded-2xl px-5 py-4 font-black tracking-wide active:scale-95 transition
                     bg-gradient-to-r from-rose-500/90 via-violet-500/80 to-indigo-500/80
                     text-ink shadow-[0_0_18px_rgba(255,74,255,0.35)] border border-rose-400/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">RPGモード</span>
            <span className="text-[10px] text-ink/70 font-bold">
              {rpgMax > 1 ? `続き Lv${rpgMax}` : 'はじめる'}
            </span>
          </div>
          <div className="text-[10px] text-ink/70 font-normal mt-0.5">500ステージ/ボス4体/勲章</div>
        </button>

        <Button full onClick={() => go('stageSelect', 'solo')}>1人で遊ぶ (CPU対戦)</Button>
        <Button full variant="secondary" onClick={() => go('stageSelect', 'duo')}>
          2人で遊ぶ (交代プレイ)
        </Button>
        <Button full variant="secondary" onClick={() => go('stageSelect', 'practice')}>
          練習モード
        </Button>
        <Button full variant="secondary" onClick={() => go('challenge', 'challenge')}>
          チャレンジ
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={() => setScreen('collection')}>
            コレクション
          </Button>
          <Button variant="ghost" onClick={() => setScreen('settings')}>
            設定
          </Button>
        </div>
      </div>

      <div className="pb-4 text-ink/40 text-[10px]">v0.2.0 RPG</div>
    </div>
  );
}

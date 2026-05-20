import { Button } from '../components/Button';
import { MedalBadge } from '../components/MedalBadge';
import { CpuLevelPicker } from '../components/CpuLevelPicker';
import { useGameStore } from '../hooks/useGameStore';
import { MEDALS } from '../data/rpgMedals';

export function RpgHomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const rpgStart = useGameStore((s) => s.rpgStart);
  const setCpuLevel = useGameStore((s) => s.setCpuLevel);
  const rpgResetProgress = useGameStore((s) => s.rpgResetProgress);

  const rpg = save.rpg;
  const hasSave = !!rpg && (rpg.maxUnlockedStage > 1 || rpg.totalWins > 0 || rpg.defeatedBosses.length > 0);
  const cpuLevel = save.cpuLevel ?? rpg?.selectedDifficulty ?? 'normal';

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-boardEdge via-board to-boardEdge text-ink p-5">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={() => setScreen('home')}>← 戻る</Button>
        <h2 className="text-xl font-black tracking-wider text-accent">RPG モード</h2>
        <div className="w-16" />
      </div>

      {/* 進行状況 */}
      <div className="rounded-2xl bg-board/70 border border-ink/10 p-4 mb-4">
        <div className="text-xs text-ink/60">到達</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-accent">Lv {rpg?.maxUnlockedStage ?? 1}</span>
          <span className="text-xs text-ink/60">/ 500</span>
        </div>
        <div className="mt-1 text-[11px] text-ink/60">
          勝 {rpg?.totalWins ?? 0} / 敗 {rpg?.totalLosses ?? 0} ・ ボス撃破 {rpg?.bossClearCount ?? 0}/4
        </div>
      </div>

      {/* 続き/最初から */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          full
          onClick={() => rpgStart({ continueFromSave: true })}
          disabled={!hasSave}
        >
          続きから
        </Button>
        <Button full variant="secondary" onClick={() => {
          if (hasSave && !window.confirm('進行をリセットしてLv1から始めますか？')) return;
          rpgResetProgress();
          rpgStart({ continueFromSave: false });
        }}>
          最初から
        </Button>
      </div>

      {/* CPUレベル(7段階) */}
      <div className="rounded-2xl bg-board/70 border border-ink/10 p-3 mb-4">
        <CpuLevelPicker value={cpuLevel} onChange={setCpuLevel} />
        <div className="text-[10px] text-ink/50 mt-2">RPGと通常CPU戦の両方に反映されます</div>
      </div>

      {/* 勲章 */}
      <div className="rounded-2xl bg-board/70 border border-ink/10 p-3 mb-4">
        <div className="text-[11px] text-ink/60 mb-2">勲章</div>
        <div className="flex items-end justify-around gap-2">
          {MEDALS.map((m) => {
            const owned = rpg?.medals?.includes(m.id) ?? false;
            return (
              <div key={m.id} className="flex flex-col items-center gap-1 min-w-0">
                <MedalBadge medal={m} owned={owned} size={58} />
                <div className={`text-[9px] text-center leading-tight ${owned ? 'text-accent' : 'text-ink/40'}`}>
                  {m.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-[10px] text-ink/40">
        ボス撃破のたびに世界の見え方が変わります
      </div>
    </div>
  );
}

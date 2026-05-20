import { Button } from '../components/Button';
import { EQUIPMENTS } from '../data/equipments';
import { STAGES } from '../data/stages';
import { ACHIEVEMENTS } from '../data/achievements';
import { useGameStore } from '../hooks/useGameStore';

export function CollectionScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);

  return (
    <div className="min-h-[100dvh] bg-boardEdge p-5 text-ink">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => setScreen('home')}>← 戻る</Button>
        <div className="font-bold">コレクション</div>
        <div className="w-16" />
      </div>

      <section className="mb-6">
        <h3 className="font-bold mb-2">装備</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(EQUIPMENTS).map((e) => {
            const unlocked = save.unlocks.includes(e.id);
            return (
              <div
                key={e.id}
                className={`p-3 rounded-xl border ${
                  unlocked ? 'bg-board border-ink/20' : 'bg-board/40 border-ink/10 opacity-60'
                }`}
              >
                <div className="font-bold text-sm">{e.name}</div>
                <div className="text-[10px] text-ink/60">★{e.rarity}</div>
                <div className="text-[11px] text-ink/70 mt-1">{unlocked ? e.description : `🔒 ${e.unlockCondition}`}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-bold mb-2">ステージ</h3>
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map((s) => {
            const unlocked = save.unlocks.includes(s.id);
            return (
              <div
                key={s.id}
                className={`p-3 rounded-xl border ${
                  unlocked ? 'bg-board border-ink/20' : 'bg-board/40 border-ink/10 opacity-60'
                }`}
              >
                <div className="font-bold text-sm">{s.name}</div>
                <div className="text-[11px] text-ink/70 mt-1">{unlocked ? s.description : `🔒 ${s.unlockCondition}`}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-2">実績</h3>
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.id} className="p-3 rounded-xl bg-board border border-ink/10">
              <div className="font-bold text-sm">{a.title}</div>
              <div className="text-[11px] text-ink/70">{a.description} / 報酬: {a.reward}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

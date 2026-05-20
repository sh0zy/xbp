import { Button } from '../components/Button';
import { useGameStore } from '../hooks/useGameStore';
import { defaultLoadouts } from '../game/engine';

const CHALLENGES = [
  { id: 'c1', title: '1手でKO', desc: '1ターンで相手を全員落とす', stage: 'desk_narrow', equip: 'pencil' as const },
  { id: 'c2', title: '防御戦', desc: '黒板消しで相手を全員落とす', stage: 'desk_obstacle', equip: 'eraserBig' as const },
  { id: 'c3', title: 'トリック', desc: '三角定規でKO勝ち', stage: 'desk_normal', equip: 'triangle' as const },
];

export function ChallengeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const startMatch = useGameStore((s) => s.startMatch);

  const start = (c: (typeof CHALLENGES)[number]) => {
    startMatch({
      mode: 'challenge',
      difficulty: 'normal',
      stageId: c.stage,
      pieceCount: 3,
      maxTurns: 6,
      loadouts: {
        1: defaultLoadouts(3, c.equip),
        2: defaultLoadouts(3, 'none'),
      },
    });
    setScreen('game');
  };

  return (
    <div className="min-h-[100dvh] bg-boardEdge p-5 text-ink">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => setScreen('home')}>← 戻る</Button>
        <div className="font-bold">チャレンジ</div>
        <div className="w-16" />
      </div>
      <div className="grid gap-3">
        {CHALLENGES.map((c) => (
          <button
            key={c.id}
            onClick={() => start(c)}
            className="text-left p-4 rounded-2xl bg-board border border-ink/20 hover:brightness-110"
          >
            <div className="font-bold">{c.title}</div>
            <div className="text-sm text-ink/70 mt-1">{c.desc}</div>
            <div className="text-[11px] text-ink/50 mt-2">stage: {c.stage} / equip: {c.equip}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

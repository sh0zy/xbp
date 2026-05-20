import { Button } from '../components/Button';
import { useGameStore } from '../hooks/useGameStore';

export function ResultScreen() {
  const winner = useGameStore((s) => s.lastWinner);
  const match = useGameStore((s) => s.match);
  const setScreen = useGameStore((s) => s.setScreen);

  const label =
    winner === null
      ? '引き分け'
      : match?.mode === 'solo'
      ? winner === 1
        ? 'あなたの勝利！'
        : 'CPUの勝利…'
      : `${winner}P の勝ち！`;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-boardEdge via-board to-boardEdge text-ink text-center">
      <div className="animate-pop">
        <div className="text-accent text-sm font-bold mb-2">RESULT</div>
        <div className="text-5xl font-black mb-4 drop-shadow">{label}</div>
        <div className="text-ink/60 text-sm">{match?.stageId}</div>
      </div>

      <div className="mt-10 w-full max-w-sm flex flex-col gap-3">
        <Button full onClick={() => setScreen('game')}>もう一回</Button>
        <Button full variant="secondary" onClick={() => setScreen('equipSelect')}>装備を変える</Button>
        <Button full variant="secondary" onClick={() => setScreen('stageSelect')}>ステージ変更</Button>
        <Button full variant="ghost" onClick={() => setScreen('home')}>ホームへ戻る</Button>
      </div>
    </div>
  );
}

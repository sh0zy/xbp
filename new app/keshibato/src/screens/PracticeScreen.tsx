import { useMemo, useState } from 'react';
import { Board } from '../components/Board';
import { Button } from '../components/Button';
import { getStage } from '../data/stages';
import { useGameStore } from '../hooks/useGameStore';
import { createInitialPieces } from '../game/engine';
import type { MatchConfig, Piece } from '../types';

const PRACTICE_FALLBACK: MatchConfig = {
  mode: 'practice',
  difficulty: 'normal',
  stageId: 'desk_normal',
  pieceCount: 3,
  maxTurns: 99,
  loadouts: {
    1: [['pencil'], ['triangle'], ['eraserBig']],
    2: [['none'], ['none'], ['none']],
  },
};

export function PracticeScreen() {
  const match = useGameStore((s) => s.match);
  const setScreen = useGameStore((s) => s.setScreen);
  const cfg = match ?? PRACTICE_FALLBACK;
  const stage = useMemo(() => getStage(cfg.stageId), [cfg.stageId]);

  const initial = useMemo(() => createInitialPieces(cfg, stage), [cfg, stage]);
  const [pieces, setPieces] = useState<Piece[]>(initial);
  const [key, setKey] = useState(0);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-boardEdge to-board text-ink flex flex-col">
      <div className="flex items-center justify-between p-3">
        <Button variant="ghost" onClick={() => setScreen('home')}>← ホーム</Button>
        <div className="font-bold">練習モード</div>
        <Button
          variant="secondary"
          onClick={() => {
            setPieces(createInitialPieces(cfg, stage));
            setKey((k) => k + 1);
          }}
        >
          リセット
        </Button>
      </div>
      <div className="flex-1 relative">
        <Board
          key={key}
          stage={stage}
          pieces={pieces}
          currentPlayer={1}
          disabled={false}
          onTurnEnd={(next) => setPieces(next)}
        />
      </div>
      <p className="text-center text-xs text-ink/60 pb-3">自由に弾いて装備の挙動を確認しよう</p>
    </div>
  );
}

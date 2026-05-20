import type { PlayerId } from '../types';

interface Props {
  currentPlayer: PlayerId;
  p1Alive: number;
  p2Alive: number;
  turn: number;
  isCpuTurn?: boolean;
}

export function HUD({ currentPlayer, p1Alive, p2Alive, turn, isCpuTurn }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm select-none">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${currentPlayer === 1 ? 'bg-p1 shadow-glow' : 'bg-p1/40'}`} />
        <span className="font-bold">1P</span>
        <span className="text-ink/70">×{p1Alive}</span>
      </div>
      <div className="font-bold text-accent">
        {isCpuTurn ? 'CPU思考中…' : `Turn ${turn}`}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-ink/70">×{p2Alive}</span>
        <span className="font-bold">2P</span>
        <span className={`w-3 h-3 rounded-full ${currentPlayer === 2 ? 'bg-p2 shadow-glow' : 'bg-p2/40'}`} />
      </div>
    </div>
  );
}

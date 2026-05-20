import type { PlayerId } from '../types';

interface Props {
  player: PlayerId;
  cpu?: boolean;
}

/** 毎ターン開始時の切り替え演出 */
export function TurnBanner({ player, cpu }: Props) {
  const color = player === 1 ? 'bg-p1' : 'bg-p2';
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className={`px-8 py-4 rounded-3xl text-3xl font-black ${color} text-boardEdge animate-slide shadow-2xl`}>
        {cpu ? 'CPUのターン' : `${player}Pのターン`}
      </div>
    </div>
  );
}

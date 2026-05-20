import type { MedalData } from '../types';
import { MEDAL_TIER_COLOR } from '../data/rpgMedals';

interface Props {
  medal: MedalData;
  owned?: boolean;
  size?: number;
}

export function MedalBadge({ medal, owned = true, size = 64 }: Props) {
  const c = MEDAL_TIER_COLOR[medal.tier];
  const r = 28;
  const pad = 8;
  const view = r * 2 + pad * 2;
  return (
    <div className={`inline-flex flex-col items-center ${owned ? '' : 'opacity-35 grayscale'}`}>
      <svg width={size} height={size} viewBox={`${-view / 2} ${-view / 2} ${view} ${view}`}>
        <defs>
          <radialGradient id={`mg-${medal.id}`}>
            <stop offset="0%" stopColor={c.rim} />
            <stop offset="100%" stopColor={c.base} />
          </radialGradient>
        </defs>
        {/* リボン */}
        <polygon points={`-12,${r - 4} -8,${r + 10} 0,${r + 6} 8,${r + 10} 12,${r - 4}`} fill={c.base} opacity={0.85} />
        {/* メダル本体 */}
        <circle r={r} fill={`url(#mg-${medal.id})`} stroke={c.rim} strokeWidth={2} />
        {/* 内輪 */}
        <circle r={r - 6} fill="none" stroke={c.rim} strokeWidth={1} opacity={0.7} />
        {/* 宝石 */}
        <circle r={5} fill={c.gem} stroke="#0b0e14" strokeWidth={0.6} />
        {/* ボスLv */}
        <text y={r - 10} textAnchor="middle" fontSize={9} fontWeight="900" fill="#0b0e14">
          Lv{medal.unlockStage}
        </text>
      </svg>
    </div>
  );
}

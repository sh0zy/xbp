import type { EquipmentId, PlayerId } from '../types';
import { BASE_MASS, BASE_RADIUS } from '../game/engine';
import { composeStats } from '../data/equipments';
import { EquipmentDecor } from './EquipmentDecor';

interface Props {
  equipments: EquipmentId[];
  owner?: PlayerId;
  size?: number;
}

/** 装備を付けた状態のコマをプレビュー表示する */
export function EquipmentPreview({ equipments, owner = 1, size = 72 }: Props) {
  const stats = composeStats(BASE_RADIUS, BASE_MASS, equipments);
  const r = Math.min(stats.radius, BASE_RADIUS * 1.35);
  const pad = 16;
  const view = r * 2 + pad * 2;
  const color = owner === 1 ? '#4ea9ff' : '#ff6b6b';

  return (
    <svg width={size} height={size} viewBox={`${-view / 2} ${-view / 2} ${view} ${view}`}>
      <ellipse cx={0} cy={r + 2} rx={r * 0.9} ry={3} fill="#00000055" />
      <circle r={r} fill={color} stroke="#f5f5f7" strokeWidth={2} />
      <EquipmentDecor
        piece={{
          id: 'preview',
          owner,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: r,
          mass: 1,
          equipments,
          alive: true,
        }}
        preview
        overrideRadius={r}
      />
      <text y={4} textAnchor="middle" fontSize={10} fontWeight="800" fill="#0b0e14">
        {owner === 1 ? '1P' : '2P'}
      </text>
    </svg>
  );
}

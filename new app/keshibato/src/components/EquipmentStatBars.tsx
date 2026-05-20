import type { EquipmentData } from '../types';

interface Props {
  equipment: EquipmentData;
}

interface Row {
  label: string;
  value: number; // 0〜100
  color: string;
}

/** 装備のステータス倍率を0-100バーに正規化して表示 */
export function EquipmentStatBars({ equipment }: Props) {
  // 倍率 0.7〜1.6 → 0〜100 (1.0を真ん中50に)
  const norm = (v: number) => Math.max(0, Math.min(100, Math.round((v - 0.7) * (100 / 0.9))));

  const rows: Row[] = [
    { label: '重さ', value: norm(equipment.weightModifier), color: 'bg-amber-400' },
    { label: 'パワー', value: norm(equipment.powerModifier), color: 'bg-rose-400' },
    { label: '安定性', value: norm(equipment.stabilityModifier), color: 'bg-emerald-400' },
    { label: 'トリッキー', value: norm(equipment.trickModifier), color: 'bg-violet-400' },
  ];

  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-[11px]">
          <div className="w-14 text-ink/70 shrink-0">{r.label}</div>
          <div className="flex-1 h-2 rounded-full bg-ink/10 overflow-hidden">
            <div className={`h-full ${r.color} transition-[width] duration-500`} style={{ width: `${r.value}%` }} />
          </div>
          <div className="w-8 text-right text-ink/60 tabular-nums">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

import type { CpuLevel } from '../types';
import { CPU_LEVEL_ORDER, CPU_LEVEL_META } from '../utils/ai';

interface Props {
  value: CpuLevel;
  onChange: (v: CpuLevel) => void;
  compact?: boolean;
}

/**
 * 7段階のCPUレベル選択UI。スマホで押しやすい段階ボタン+スライダー的にレベル表示。
 */
export function CpuLevelPicker({ value, onChange, compact }: Props) {
  const currentMeta = CPU_LEVEL_META[value];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-ink/60">CPUレベル</div>
        <div className="text-[11px] text-accent font-bold">{currentMeta.label}</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {CPU_LEVEL_ORDER.map((lv) => {
          const meta = CPU_LEVEL_META[lv];
          const active = lv === value;
          return (
            <button
              key={lv}
              onClick={() => onChange(lv)}
              className={`text-[10px] leading-tight rounded-lg border py-1.5 font-bold ${
                active
                  ? 'bg-accent text-boardEdge border-accent shadow-glow'
                  : 'bg-board text-ink/70 border-ink/20'
              }`}
              aria-pressed={active}
            >
              <div>{meta.rank}</div>
              <div className="text-[9px] font-normal">{meta.shortLabel}</div>
            </button>
          );
        })}
      </div>
      {!compact && (
        <div className="text-[11px] text-ink/60 leading-snug">{currentMeta.hint}</div>
      )}
    </div>
  );
}

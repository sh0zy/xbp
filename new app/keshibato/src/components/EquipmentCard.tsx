import type { EquipmentData, PlayerId } from '../types';
import { EquipmentPreview } from './EquipmentPreview';
import { EquippedBadge } from './EquippedBadge';

interface Props {
  equipment: EquipmentData;
  equipped: boolean;
  selected: boolean;   // 詳細パネル表示中のカード
  locked: boolean;
  disabled: boolean;   // スロット上限などで新規装着不可
  onTap: () => void;
  onLongTap?: () => void; // 詳細表示(任意)
  equipIndex?: number; // 装着順(1,2)
  owner?: PlayerId;
  favorite?: boolean;
  badgeLabel?: string; // 最近/おすすめ等
  onToggleFavorite?: () => void;
}

// 性能バー 0〜1 に正規化する簡易ヘルパ
function bar(val: number): number {
  return Math.max(0, Math.min(1, (val - 0.6) / 1.0));
}

const difficultyLabel = { easy: '初級', normal: '中級', hard: '上級' } as const;
const difficultyColor = {
  easy: 'bg-emerald-500/30 text-emerald-200',
  normal: 'bg-amber-500/30 text-amber-200',
  hard: 'bg-rose-500/30 text-rose-200',
} as const;
const categoryLabel = { attack: '攻撃', defense: '防御', trick: '変則', support: '補助' } as const;

export function EquipmentCard({
  equipment,
  equipped,
  selected,
  locked,
  disabled,
  onTap,
  equipIndex,
  owner,
  favorite,
  badgeLabel,
  onToggleFavorite,
}: Props) {
  const base = 'relative text-left p-2.5 rounded-2xl border transition active:scale-[0.98]';
  const state = locked
    ? 'bg-board/40 border-ink/10 opacity-55'
    : equipped
    ? 'bg-accent/20 border-accent shadow-glow'
    : selected
    ? 'bg-board border-accent/60'
    : 'bg-board border-ink/20';
  const dimmed = disabled && !equipped && !selected ? 'opacity-60' : '';

  return (
    <div className={`${base} ${state} ${dimmed}`}>
      <button onClick={onTap} disabled={locked} className="w-full text-left">
        {equipped && <EquippedBadge index={equipIndex} />}
        <div className="flex items-center gap-2">
          <div className="shrink-0 rounded-xl bg-boardEdge/70 p-1.5">
            <EquipmentPreview equipments={[equipment.id]} owner={owner} size={48} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-sm truncate">{equipment.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${difficultyColor[equipment.difficulty]}`}>
                {difficultyLabel[equipment.difficulty]}
              </span>
            </div>
            <div className="text-[10px] text-accent/90 mt-0.5 truncate">{equipment.shortCatch}</div>
            <div className="text-[10px] text-ink/60">
              {categoryLabel[equipment.category]} / ★{equipment.rarity}
            </div>
          </div>
        </div>
        {/* 性能バー(重さ/パワー/安定/トリッキー) */}
        <div className="mt-2 grid grid-cols-4 gap-1">
          <Stat label="重" v={bar(equipment.weightModifier)} />
          <Stat label="攻" v={bar(equipment.powerModifier)} />
          <Stat label="安" v={bar(equipment.stabilityModifier)} />
          <Stat label="変" v={bar(equipment.trickModifier)} />
        </div>
      </button>
      {badgeLabel && (
        <div className="absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-accent/80 text-boardEdge font-bold">
          {badgeLabel}
        </div>
      )}
      {onToggleFavorite && !locked && (
        <button
          onClick={onToggleFavorite}
          aria-label="favorite"
          className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
            favorite ? 'bg-accent text-boardEdge' : 'bg-black/30 text-ink/60'
          }`}
        >
          {favorite ? '★' : '☆'}
        </button>
      )}
      {locked && (
        <div className="absolute inset-0 rounded-2xl bg-boardEdge/55 flex items-center justify-center">
          <div className="text-[11px] text-ink/80 bg-boardEdge/85 px-2 py-1 rounded-lg">
            🔒 {equipment.unlockCondition}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] text-ink/60 w-3">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${Math.round(v * 100)}%` }} />
      </div>
    </div>
  );
}

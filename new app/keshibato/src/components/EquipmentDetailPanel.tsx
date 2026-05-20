import type { EquipmentData, PlayerId } from '../types';
import { EquipmentPreview } from './EquipmentPreview';
import { EquipmentStatBars } from './EquipmentStatBars';
import { Button } from './Button';

interface Props {
  equipment: EquipmentData | null;
  equipped: boolean;
  /** 既に他スロット装着が上限でこの装備をさらに追加できない */
  full: boolean;
  locked: boolean;
  onToggle: () => void;
  onClose: () => void;
  owner?: PlayerId;
}

const difficultyLabel = { easy: '初級者向け', normal: '中級者向け', hard: '上級者向け' } as const;
const categoryLabel = { attack: '攻撃型', defense: '防御型', trick: '変則型', support: '補助型' } as const;

export function EquipmentDetailPanel({
  equipment,
  equipped,
  full,
  locked,
  onToggle,
  onClose,
  owner,
}: Props) {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center">
      <button
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div className="relative w-full max-w-md bg-board border-t border-accent/40 rounded-t-3xl p-5 pb-8 animate-slide">
        <div className="w-10 h-1.5 bg-ink/20 rounded-full mx-auto mb-3" />
        <div className="flex gap-3 items-start">
          <div className="shrink-0 rounded-2xl bg-boardEdge p-2">
            <EquipmentPreview equipments={[equipment.id]} owner={owner} size={88} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black">{equipment.name}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink/10 text-ink/70">★{equipment.rarity}</span>
            </div>
            <div className="text-accent text-sm font-bold">{equipment.shortCatch}</div>
            <div className="text-[11px] text-ink/60 mt-1">
              {categoryLabel[equipment.category]} ・ {difficultyLabel[equipment.difficulty]}
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-ink/80 leading-snug">{equipment.description}</p>

        <div className="mt-3 rounded-xl bg-boardEdge/70 p-3">
          <div className="text-[10px] text-ink/60 mb-2 font-bold tracking-wide">ステータス変化</div>
          <EquipmentStatBars equipment={equipment} />
        </div>

        <div className="mt-3 rounded-xl bg-boardEdge/50 p-3">
          <div className="text-[10px] text-ink/60 mb-1 font-bold tracking-wide">向いている戦い方</div>
          <div className="text-sm text-ink/90">{equipment.recommendedPlayStyle}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="ghost" onClick={onClose}>閉じる</Button>
          <Button
            full
            variant={equipped ? 'danger' : 'primary'}
            onClick={onToggle}
            disabled={locked || (!equipped && full)}
          >
            {locked ? '🔒 解放条件未達' : equipped ? '外す' : full ? '他を外す必要あり' : 'このコマに装着'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { EquipmentCard } from '../components/EquipmentCard';
import { EquipmentDetailPanel } from '../components/EquipmentDetailPanel';
import { EquipmentPreview } from '../components/EquipmentPreview';
import { EQUIPMENTS } from '../data/equipments';
import { useGameStore } from '../hooks/useGameStore';
import type { EquipmentCategory, EquipmentId, PlayerId } from '../types';

type FilterKey = 'all' | 'favorite' | 'recent' | 'beginner' | 'advanced' | EquipmentCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'favorite', label: '★お気に入り' },
  { key: 'recent', label: '最近' },
  { key: 'beginner', label: '初心者向け' },
  { key: 'attack', label: '攻撃' },
  { key: 'defense', label: '防御' },
  { key: 'trick', label: '変則' },
  { key: 'support', label: '補助/安定' },
  { key: 'advanced', label: '上級者向け' },
];

type SortKey = 'default' | 'power' | 'stability' | 'weight' | 'trick';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'default', label: '既定' },
  { key: 'power', label: 'パワー↓' },
  { key: 'stability', label: '安定↓' },
  { key: 'weight', label: '重さ↓' },
  { key: 'trick', label: 'トリッキー↓' },
];

export function EquipSelectScreen() {
  const match = useGameStore((s) => s.match);
  const setLoadout = useGameStore((s) => s.setLoadout);
  const setScreen = useGameStore((s) => s.setScreen);
  const save = useGameStore((s) => s.save);
  const toggleFav = useGameStore((s) => s.toggleEquipFavorite);
  const pushRecent = useGameStore((s) => s.pushEquipRecent);
  const savePreset = useGameStore((s) => s.saveEquipPreset);
  const deletePreset = useGameStore((s) => s.deleteEquipPreset);
  const applyPreset = useGameStore((s) => s.applyEquipPreset);

  const [activePlayer, setActivePlayer] = useState<PlayerId>(1);
  const [activeSlot, setActiveSlot] = useState(0);
  const [detailId, setDetailId] = useState<EquipmentId | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [presetOpen, setPresetOpen] = useState(false);

  const favs = save.equipFavorites ?? [];
  const recents = save.equipRecents ?? [];
  const presets = save.equipPresets ?? [];

  const allEquips = useMemo(
    () => (Object.values(EQUIPMENTS) as (typeof EQUIPMENTS)[EquipmentId][]),
    []
  );

  const visibleEquips = useMemo(() => {
    let list = allEquips;
    if (filter === 'favorite') list = list.filter((e) => favs.includes(e.id));
    else if (filter === 'recent') list = recents.map((id) => EQUIPMENTS[id]).filter(Boolean);
    else if (filter === 'beginner') list = list.filter((e) => e.difficulty === 'easy');
    else if (filter === 'advanced') list = list.filter((e) => e.difficulty === 'hard');
    else if (filter !== 'all') list = list.filter((e) => e.category === filter);
    switch (sort) {
      case 'power': return [...list].sort((a, b) => b.powerModifier - a.powerModifier);
      case 'stability': return [...list].sort((a, b) => b.stabilityModifier - a.stabilityModifier);
      case 'weight': return [...list].sort((a, b) => b.weightModifier - a.weightModifier);
      case 'trick': return [...list].sort((a, b) => b.trickModifier - a.trickModifier);
      default: return list;
    }
  }, [allEquips, filter, favs, recents, sort]);

  if (!match) return null;
  const slot = match.loadouts[activePlayer][activeSlot] ?? [];

  const toggle = (id: EquipmentId) => {
    const next = slot.includes(id) ? slot.filter((e) => e !== id) : [...slot, id];
    setLoadout(activePlayer, activeSlot, next);
    if (!slot.includes(id)) pushRecent(id);
  };

  const startable = () => setScreen('game');
  const detailEq = detailId ? EQUIPMENTS[detailId] : null;
  const detailLocked = detailId ? !save.unlocks.includes(detailId) : false;
  const detailEquipped = detailId ? slot.includes(detailId) : false;
  const slotFull = slot.length >= 2;

  const savePresetFromSlot = () => {
    if (slot.length === 0) return;
    const name = window.prompt('プリセット名', `プリセット${presets.length + 1}`) ?? '';
    savePreset(name, slot);
  };

  return (
    <div className="min-h-[100dvh] p-4 pb-28 bg-boardEdge text-ink">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={() => setScreen('stageSelect')}>← 戻る</Button>
        <h2 className="text-xl font-bold">装備選択</h2>
        <Button variant="ghost" onClick={() => setPresetOpen((v) => !v)}>
          プリセット{presetOpen ? '▲' : '▼'}
        </Button>
      </div>

      {/* プレイヤータブ */}
      <div className="flex gap-2 mb-2">
        {([1, 2] as PlayerId[]).map((p) => {
          const isCpu = match.mode === 'solo' && p === 2;
          return (
            <button
              key={p}
              onClick={() => setActivePlayer(p)}
              className={`flex-1 py-2 rounded-xl font-bold ${
                activePlayer === p ? 'bg-accent text-boardEdge' : 'bg-board text-ink/70'
              }`}
            >
              {p}P {isCpu && '(CPU)'}
            </button>
          );
        })}
      </div>

      {/* コマスロット */}
      <div className="flex gap-2 mb-2">
        {Array.from({ length: match.pieceCount }).map((_, i) => {
          const eqs = match.loadouts[activePlayer][i] ?? [];
          const active = activeSlot === i;
          return (
            <button
              key={i}
              onClick={() => setActiveSlot(i)}
              className={`flex-1 py-1.5 rounded-xl text-xs flex flex-col items-center gap-1 ${
                active ? 'bg-accent/80 text-boardEdge font-bold' : 'bg-board text-ink/70'
              }`}
            >
              <EquipmentPreview equipments={eqs} owner={activePlayer} size={36} />
              <span>コマ{i + 1} ({eqs.length}/2)</span>
            </button>
          );
        })}
      </div>

      {/* プリセットパネル */}
      {presetOpen && (
        <div className="rounded-2xl bg-board/80 border border-ink/20 p-3 mb-2 space-y-2">
          <div className="flex gap-2">
            <Button onClick={savePresetFromSlot} variant="secondary">現在のスロットを保存</Button>
          </div>
          {presets.length === 0 && (
            <div className="text-[11px] text-ink/60">プリセットはまだありません。保存するとワンタップで適用できます。</div>
          )}
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <div key={p.id} className="flex items-center gap-1 bg-boardEdge/60 rounded-full px-2 py-1">
                <button
                  onClick={() => { applyPreset(p); setPresetOpen(false); }}
                  className="text-[11px] font-bold text-accent"
                >
                  {p.name}
                </button>
                <span className="text-[10px] text-ink/60">
                  {p.equipments.map((id) => EQUIPMENTS[id]?.name ?? id).join('+')}
                </span>
                <button
                  onClick={() => deletePreset(p.id)}
                  className="text-[10px] text-rose-300 px-1"
                  aria-label="delete"
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フィルタ */}
      <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 mb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs border ${
              filter === f.key
                ? 'bg-accent text-boardEdge border-accent font-bold'
                : 'bg-board text-ink/70 border-ink/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {/* ソート */}
      <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 mb-2">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`shrink-0 px-2 py-1 rounded-md text-[10px] border ${
              sort === s.key
                ? 'bg-ink/80 text-boardEdge border-ink/60 font-bold'
                : 'bg-board text-ink/60 border-ink/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-ink/60 mb-2">
        タップで詳細/装着。★で個別お気に入り登録。1コマ最大2個。
      </p>

      {/* 装備カード一覧 */}
      <div className="grid grid-cols-2 gap-2">
        {visibleEquips.length === 0 && (
          <div className="col-span-2 text-center text-ink/50 text-sm py-6">該当なし</div>
        )}
        {visibleEquips.map((e) => {
          const locked = !save.unlocks.includes(e.id);
          const equipped = slot.includes(e.id);
          const idx = equipped ? slot.indexOf(e.id) : undefined;
          const disabled = !equipped && slotFull && e.id !== 'none';
          const selected = detailId === e.id;
          const isFav = favs.includes(e.id);
          const recentIdx = recents.indexOf(e.id);
          const badge = recentIdx === 0 ? '最近' : e.difficulty === 'easy' ? 'おすすめ' : undefined;
          return (
            <EquipmentCard
              key={e.id}
              equipment={e}
              equipped={equipped}
              selected={selected}
              locked={locked}
              disabled={disabled}
              owner={activePlayer}
              equipIndex={idx}
              favorite={isFav}
              badgeLabel={badge}
              onToggleFavorite={() => toggleFav(e.id)}
              onTap={() => setDetailId(e.id)}
            />
          );
        })}
      </div>

      {/* フッター */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-boardEdge/95 border-t border-ink/10 backdrop-blur">
        <div className="max-w-md mx-auto flex gap-2 items-center">
          <div className="text-[11px] text-ink/70">装着 {slot.length}/2</div>
          <div className="flex-1" />
          <Button onClick={startable}>試合開始</Button>
        </div>
      </div>

      {/* 詳細パネル */}
      <EquipmentDetailPanel
        equipment={detailEq}
        equipped={detailEquipped}
        full={slotFull}
        locked={detailLocked}
        owner={activePlayer}
        onToggle={() => {
          if (!detailId || detailLocked) return;
          toggle(detailId);
          setDetailId(null);
        }}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}

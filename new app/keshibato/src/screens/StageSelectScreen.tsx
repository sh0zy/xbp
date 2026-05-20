import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { STAGES, getStagesForMode } from '../data/stages';
import { getStageTheme } from '../data/stageThemes';
import { useGameStore } from '../hooks/useGameStore';
import type { StageData, StageCategoryTag } from '../types';

type CategoryKey = 'all' | 'favorite' | 'recent' | StageCategoryTag;

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'favorite', label: '★お気に入り' },
  { key: 'recent', label: '最近' },
  { key: 'beginner', label: '初級' },
  { key: 'balanced', label: 'バランス' },
  { key: 'technical', label: 'テクニカル' },
  { key: 'narrow', label: '狭い' },
  { key: 'obstacle', label: '障害物' },
  { key: 'bumper', label: 'バンパー' },
  { key: 'slippery', label: '滑り' },
  { key: 'hazard', label: '危険' },
  { key: 'chaotic', label: 'カオス' },
  { key: 'symmetric', label: '対称' },
  { key: 'advanced', label: '上級' },
];

export function StageSelectScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setStage = useGameStore((s) => s.setStage);
  const save = useGameStore((s) => s.save);
  const match = useGameStore((s) => s.match);
  const toggleFav = useGameStore((s) => s.toggleStageFavorite);
  const pushRecent = useGameStore((s) => s.pushStageRecent);

  const [cat, setCat] = useState<CategoryKey>('all');

  const mode = match?.mode;
  // mode=solo→single, duo→versus, それ以外(practice/challenge)は汎用
  const listMode = mode === 'solo' ? 'single' : mode === 'duo' ? 'versus' : undefined;

  const baseList: StageData[] = useMemo(() => {
    if (listMode === 'single') return getStagesForMode('single');
    if (listMode === 'versus') return getStagesForMode('versus');
    return STAGES.filter((s) => s.mode !== 'single' && s.mode !== 'versus'); // 汎用(practice/challenge)
  }, [listMode]);

  const favs = save.stageFavorites ?? [];
  const recents = save.stageRecents ?? [];

  const filtered: StageData[] = useMemo(() => {
    if (cat === 'all') return baseList;
    if (cat === 'favorite') return baseList.filter((s) => favs.includes(s.id));
    if (cat === 'recent') return recents.map((id) => baseList.find((s) => s.id === id)).filter(Boolean) as StageData[];
    return baseList.filter((s) => s.tags?.includes(cat));
  }, [baseList, cat, favs, recents]);

  const nextLabel = match?.mode === 'practice' ? '練習開始' : '装備選択へ';
  const go = (sid: string) => {
    pushRecent(sid);
    setStage(sid);
    if (match?.mode === 'practice') setScreen('practice');
    else setScreen('equipSelect');
  };
  const goRandom = () => {
    const list = filtered.length ? filtered : baseList;
    const pick = list[Math.floor(Math.random() * list.length)];
    if (pick) go(pick.id);
  };

  return (
    <div className="min-h-[100dvh] p-5 pb-24 bg-boardEdge text-ink">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={() => setScreen('home')}>← 戻る</Button>
        <h2 className="text-xl font-bold">ステージ選択</h2>
        <Button variant="ghost" onClick={goRandom}>🎲 ランダム</Button>
      </div>

      <div className="text-[11px] text-ink/60 mb-2">
        {listMode === 'single' && '1人用(CPU戦)ステージ'}
        {listMode === 'versus' && '2人用 対戦ステージ'}
        {!listMode && '共通ステージ'}
      </div>

      {/* カテゴリ */}
      <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-2 mb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs border ${
              cat === c.key
                ? 'bg-accent text-boardEdge border-accent font-bold'
                : 'bg-board text-ink/70 border-ink/20'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 && (
          <div className="text-center text-ink/50 text-sm py-6">該当なし</div>
        )}
        {filtered.map((st) => {
          const locked = !save.unlocks.includes(st.id);
          const theme = getStageTheme(st.uiThemeId);
          const fav = favs.includes(st.id);
          const recIdx = recents.indexOf(st.id);
          return (
            <div
              key={st.id}
              className={`relative rounded-2xl border overflow-hidden ${theme.borderClass} ${
                locked ? 'opacity-60' : 'hover:brightness-110'
              }`}
            >
              <button
                disabled={locked}
                onClick={() => go(st.id)}
                className={`w-full text-left p-4 ${theme.backgroundClass} ${theme.textClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-lg">{st.name}</div>
                  <div className="text-[10px] opacity-75">
                    {locked ? `🔒 ${st.unlockCondition}` : theme.moodLabel ?? ''}
                  </div>
                </div>
                <div className="text-sm opacity-80 mt-1">{st.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(st.tags ?? []).slice(0, 4).map((t) => (
                    <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded ${theme.panelClass} border ${theme.borderClass}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] opacity-70 mt-2 flex gap-3">
                  <span>{st.width}×{st.height}</span>
                  <span>障害物 {st.obstacles.length}</span>
                  {st.recommendedCpuLevel && <span>推奨CPU Lv{st.recommendedCpuLevel}</span>}
                  {recIdx === 0 && <span className="text-accent">◀最近</span>}
                </div>
              </button>
              <button
                onClick={() => toggleFav(st.id)}
                aria-label="favorite"
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  fav ? 'bg-accent text-boardEdge' : 'bg-black/40 text-ink/60'
                }`}
              >
                {fav ? '★' : '☆'}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink/40 mt-4">選んだら{nextLabel}に進みます</p>
    </div>
  );
}

import { useState, type ChangeEvent } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { AppBrand } from '@/components/AppBrand';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { EmptyState } from '@/features/notes/components/EmptyState';
import { FilterTabs } from '@/features/notes/components/FilterTabs';
import { NoteCard } from '@/features/notes/components/NoteCard';
import { useNotes } from '@/features/notes/hooks/useNotes';
import type { NoteFilter, SortOrder } from '@/features/notes/types/note';
import { getHomeNoteGroups } from '@/features/notes/utils/noteSelectors';

const HOME_FILTERS = [
  { value: 'all', label: 'すべて' },
  { value: 'pinned', label: 'ピン留め' },
  { value: 'favorite', label: 'お気に入り' },
] as const satisfies ReadonlyArray<{ value: NoteFilter; label: string }>;

const SORT_LABELS: Record<SortOrder, string> = {
  updatedDesc: '更新順',
  createdDesc: '作成順',
  titleAsc: 'タイトル順',
};

export function HomePage() {
  const { notes, settings, updateSortOrder } = useNotes();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NoteFilter>('all');
  const { pinnedNotes, regularNotes } = getHomeNoteGroups(notes, filter, query.trim(), settings.sortOrder);
  const activeNotes = notes.filter((note) => !note.isArchived);
  const favoriteCount = notes.filter((note) => note.isFavorite && !note.isArchived).length;
  const pinnedCount = notes.filter((note) => note.isPinned && !note.isArchived).length;
  const hasVisibleNotes = pinnedNotes.length > 0 || regularNotes.length > 0;

  return (
    <>
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+120px)] pt-[calc(env(safe-area-inset-top)+18px)]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,21,35,0.98),rgba(11,13,19,0.92))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-500/18 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-8 h-24 w-24 rounded-full bg-sky-300/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-white/42">NoteFrame</p>
              <h1 className="mt-3 font-display text-[1.9rem] font-semibold leading-[1.1] text-white">
                日々の断片を、
                <br />
                静かに整える。
              </h1>
              <p className="mt-3 max-w-[17rem] text-sm leading-6 text-white/62">
                オフライン中心で使える、縦画面向けのメモボード。最初の1枚がそのまま絵になるように整えています。
              </p>
            </div>

            <AppBrand />
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-[22px] border border-white/8 bg-white/6 px-3 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">Notes</p>
              <p className="mt-2 font-display text-xl font-semibold text-white">{activeNotes.length}</p>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/6 px-3 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">Pinned</p>
              <p className="mt-2 font-display text-xl font-semibold text-white">{pinnedCount}</p>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/6 px-3 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/42">Favorite</p>
              <p className="mt-2 font-display text-xl font-semibold text-white">{favoriteCount}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/10 bg-[rgba(12,15,23,0.78)] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
            <Search className="h-[1.125rem] w-[1.125rem] text-white/44" />
            <input
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              type="search"
              placeholder="タイトルや本文を検索"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/56 transition hover:bg-white/12"
                aria-label="検索をクリア"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <FilterTabs value={filter} options={HOME_FILTERS} onChange={setFilter} />
            <label className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/64">
              <SlidersHorizontal className="h-4 w-4" />
              <select
                value={settings.sortOrder}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  void updateSortOrder(event.target.value as SortOrder)
                }
                className="bg-transparent pr-1 text-sm text-white outline-none"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {!hasVisibleNotes ? (
          <section className="mt-6">
            <EmptyState
              title={query ? '条件に合うメモがありません' : 'まだメモがありません'}
              description={
                query
                  ? '別のキーワードで探すか、フィルタを戻してみてください。'
                  : '右下のボタンから、最初の1枚をすぐに作成できます。'
              }
              actionLabel="新規メモを作成"
              actionTo="/note/new"
            />
          </section>
        ) : (
          <>
            {pinnedNotes.length > 0 ? (
              <section className="mt-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/34">Pinned</p>
                    <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold text-white">
                      <Sparkles className="h-5 w-5 text-violet-200" />
                      目に入れておきたいメモ
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/56">
                    {pinnedNotes.length}件
                  </span>
                </div>

                <div className="columns-2 gap-3">
                  {pinnedNotes.map((note) => (
                    <div key={note.id} className="mb-3 break-inside-avoid">
                      <NoteCard note={note} href={`/note/${note.id}`} />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {regularNotes.length > 0 ? (
              <section className="mt-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/34">Library</p>
                    <h2 className="mt-2 font-display text-xl font-semibold text-white">日常のメモ</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/56">
                    {regularNotes.length}件
                  </span>
                </div>

                <div className="columns-2 gap-3">
                  {regularNotes.map((note) => (
                    <div key={note.id} className="mb-3 break-inside-avoid">
                      <NoteCard note={note} href={`/note/${note.id}`} />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>

      <FloatingActionButton />
    </>
  );
}

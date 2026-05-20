import { useState, type ChangeEvent } from 'react';
import { RotateCcw, Search, Trash2, X } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/features/notes/components/EmptyState';
import { NoteArchiveMeta, NoteCard } from '@/features/notes/components/NoteCard';
import { useNotes } from '@/features/notes/hooks/useNotes';
import { getArchivedNotes } from '@/features/notes/utils/noteSelectors';

export function ArchivePage() {
  const { notes, settings, restoreNote, permanentlyDeleteNote } = useNotes();
  const [query, setQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const archivedNotes = getArchivedNotes(notes, query.trim(), settings.sortOrder);

  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+120px)] pt-[calc(env(safe-area-inset-top)+18px)]">
        <PageHeader title="アーカイブ" subtitle="保管しておきたいメモを、あとから静かに見返せます。" />

        <section className="mt-5 rounded-[28px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-4">
          <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
            <Search className="h-[1.125rem] w-[1.125rem] text-white/44" />
            <input
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              type="search"
              placeholder="アーカイブ内を検索"
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
        </section>

        {archivedNotes.length === 0 ? (
          <section className="mt-6">
            <EmptyState
              title={query ? '見つかりませんでした' : 'アーカイブは空です'}
              description={
                query
                  ? '別のキーワードで検索してみてください。'
                  : 'Editor からアーカイブに切り替えたメモがここに表示されます。'
              }
              actionLabel="ホームへ戻る"
              actionTo="/"
            />
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {archivedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                footer={
                  <div className="space-y-3">
                    <NoteArchiveMeta />
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => void restoreNote(note.id)}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/6 px-3 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        <RotateCcw className="h-4 w-4" />
                        復元
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedNoteId(note.id)}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-[18px] border border-rose-400/16 bg-rose-500/10 px-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/16"
                      >
                        <Trash2 className="h-4 w-4" />
                        完全削除
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </section>
        )}
      </main>

      <ConfirmDialog
        open={selectedNoteId !== null}
        title="完全に削除しますか？"
        description="アーカイブから削除すると、メモ内容は復元できません。"
        confirmLabel="完全削除"
        destructive
        onConfirm={() => {
          if (!selectedNoteId) {
            return;
          }

          void permanentlyDeleteNote(selectedNoteId);
          setSelectedNoteId(null);
        }}
        onCancel={() => setSelectedNoteId(null)}
      />
    </>
  );
}

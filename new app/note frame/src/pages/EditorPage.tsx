import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { Archive, Heart, Pin, Save, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { useNotes } from '@/features/notes/hooks/useNotes';
import { NOTE_COLORS, type NoteInput } from '@/features/notes/types/note';
import { formatDetailDate } from '@/features/notes/utils/date';
import { NOTE_COLOR_STYLES } from '@/features/notes/utils/noteColors';
import { createDraftInput } from '@/features/notes/utils/noteFactory';
import { cn } from '@/lib/cn';

interface ToggleChipProps {
  label: string;
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
}

function ToggleChip({ label, active, icon, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-12 items-center justify-between rounded-[22px] border px-4 py-3 text-sm font-medium transition',
        active ? 'border-white/12 bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.12)]' : 'border-white/10 bg-white/6 text-white/72',
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full',
            active ? 'bg-slate-950/10 text-slate-950' : 'bg-white/10 text-white/72',
          )}
        >
          {icon}
        </span>
        {label}
      </span>
    </button>
  );
}

export function EditorPage() {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();
  const { getNoteById, createNote, updateNote, deleteNote, isReady } = useNotes();
  const existingNote = noteId ? getNoteById(noteId) : undefined;
  const [form, setForm] = useState<NoteInput>(createDraftInput());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(noteId);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (existingNote) {
      setForm({
        title: existingNote.title,
        content: existingNote.content,
        color: existingNote.color,
        isPinned: existingNote.isPinned,
        isFavorite: existingNote.isFavorite,
        isArchived: existingNote.isArchived,
      });
      return;
    }

    setForm(createDraftInput());
  }, [existingNote, isReady]);

  async function handleSave(): Promise<void> {
    setIsSaving(true);

    try {
      if (existingNote && noteId) {
        await updateNote(noteId, form);
      } else {
        await createNote(form);
      }

      navigate(form.isArchived ? '/archive' : '/');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!noteId) {
      return;
    }

    await deleteNote(noteId);
    setConfirmDeleteOpen(false);
    navigate(existingNote?.isArchived ? '/archive' : '/');
  }

  function updateField<Key extends keyof NoteInput>(key: Key, value: NoteInput[Key]): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (isEditing && isReady && !existingNote) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pb-12 pt-[calc(env(safe-area-inset-top)+18px)]">
        <PageHeader title="メモが見つかりません" subtitle="削除されたか、保存前のデータです。" backTo="/" />
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+108px)] pt-[calc(env(safe-area-inset-top)+18px)]">
        <PageHeader
          title={existingNote ? 'メモを編集' : '新しいメモ'}
          subtitle={
            existingNote
              ? `最終更新 ${formatDetailDate(existingNote.updatedAt)}`
              : '思いついた瞬間を、そのまま残せます。'
          }
          backTo={form.isArchived ? '/archive' : '/'}
        />

        <section className="mt-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,19,29,0.96),rgba(10,12,18,0.96))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <label className="block">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/34">Title</span>
            <input
              value={form.title}
              onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('title', event.target.value)}
              type="text"
              placeholder="タイトルを入力"
              className="mt-3 w-full border-none bg-transparent font-display text-[1.85rem] font-semibold leading-[1.16] text-white outline-none placeholder:text-white/28"
            />
          </label>

          <div className="mt-5 h-px bg-white/8" />

          <label className="mt-5 block">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/34">Content</span>
            <textarea
              value={form.content}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField('content', event.target.value)}
              placeholder="本文を入力"
              className="mt-3 min-h-[280px] w-full resize-none border-none bg-transparent text-[0.98rem] leading-8 text-white/82 outline-none placeholder:text-white/28"
            />
          </label>
        </section>

        <section className="mt-5 rounded-[30px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34">Color</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">カードの色味</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/54">
              {NOTE_COLOR_STYLES[form.color].label}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-3">
            {NOTE_COLORS.map((color) => {
              const palette = NOTE_COLOR_STYLES[color];

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField('color', color)}
                  className={cn(
                    'h-14 rounded-[20px] border transition',
                    palette.cardClassName,
                    form.color === color ? `ring-2 ring-offset-2 ring-offset-[rgb(var(--app-bg))] ${palette.ringClassName}` : '',
                  )}
                  aria-label={palette.label}
                />
              );
            })}
          </div>
        </section>

        <section className="mt-5 space-y-3 rounded-[30px] border border-white/10 bg-[rgba(12,15,23,0.82)] p-5">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/34">States</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-white">表示オプション</h2>
          </div>

          <div className="grid gap-3">
            <ToggleChip
              label="ピン留めする"
              active={form.isPinned}
              icon={<Pin className="h-[1.125rem] w-[1.125rem]" />}
              onClick={() => updateField('isPinned', !form.isPinned)}
            />
            <ToggleChip
              label="お気に入りにする"
              active={form.isFavorite}
              icon={<Heart className="h-[1.125rem] w-[1.125rem]" />}
              onClick={() => updateField('isFavorite', !form.isFavorite)}
            />
            <ToggleChip
              label="アーカイブへ移動"
              active={form.isArchived}
              icon={<Archive className="h-[1.125rem] w-[1.125rem]" />}
              onClick={() => updateField('isArchived', !form.isArchived)}
            />
          </div>
        </section>

        {existingNote ? (
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] border border-rose-400/18 bg-rose-500/10 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-500/14"
          >
            <Trash2 className="h-[1.125rem] w-[1.125rem]" />
            このメモを削除
          </button>
        ) : null}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[rgba(8,10,16,0.84)] px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4 backdrop-blur-xl">
        <div className="mx-auto max-w-[430px]">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-[24px] bg-white px-5 font-semibold text-slate-950 shadow-[0_20px_48px_rgba(255,255,255,0.16)] transition hover:bg-white/92 disabled:cursor-wait disabled:opacity-70"
          >
            <Save className="h-5 w-5" />
            {isSaving ? '保存中...' : '保存して戻る'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="このメモを削除しますか？"
        description="削除すると元に戻せません。必要ならアーカイブに移動して残しておく方法もあります。"
        confirmLabel="削除する"
        destructive
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}

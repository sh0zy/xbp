import type { ReactNode } from 'react';
import { Heart, Pin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Note } from '@/features/notes/types/note';
import { formatCardDate } from '@/features/notes/utils/date';
import { NOTE_COLOR_STYLES } from '@/features/notes/utils/noteColors';
import { cn } from '@/lib/cn';

interface NoteCardProps {
  note: Note;
  href?: string;
  footer?: ReactNode;
}

export function NoteCard({ note, href, footer }: NoteCardProps) {
  const palette = NOTE_COLOR_STYLES[note.color];
  const containerClassName = cn(
    'group relative flex w-full flex-col rounded-[26px] border p-4 transition-transform duration-200 hover:-translate-y-0.5',
    palette.cardClassName,
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.74rem] font-medium',
            palette.badgeClassName,
          )}
        >
          <span className={cn('h-2.5 w-2.5 rounded-full', palette.dotClassName)} />
          <span>{palette.label}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          {note.isPinned ? (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]">
              <Pin className="h-4 w-4" />
            </span>
          ) : null}
          {note.isFavorite ? (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-rose-200">
              <Heart className="h-4 w-4 fill-current" />
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-2 font-display text-[1.08rem] font-semibold leading-[1.35] text-white">{note.title}</h3>
        <p className="mt-3 line-clamp-5 whitespace-pre-line break-words text-sm leading-6 text-white/70">
          {note.content || '本文はまだありません。'}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-[0.76rem] uppercase tracking-[0.18em] text-white/38">
        <span>Updated</span>
        <span>{formatCardDate(note.updatedAt)}</span>
      </div>

      {footer ? <div className="mt-4 border-t border-white/8 pt-4">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={containerClassName}>
        {content}
      </Link>
    );
  }

  return <article className={containerClassName}>{content}</article>;
}

export function NoteArchiveMeta() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/54">
      <RefreshCw className="h-3.5 w-3.5" />
      Archived
    </div>
  );
}

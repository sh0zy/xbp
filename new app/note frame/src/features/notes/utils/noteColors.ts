import type { NoteColor } from '@/features/notes/types/note';

export interface NoteColorStyle {
  label: string;
  dotClassName: string;
  badgeClassName: string;
  cardClassName: string;
  softSurfaceClassName: string;
  ringClassName: string;
}

export const NOTE_COLOR_STYLES: Record<NoteColor, NoteColorStyle> = {
  indigo: {
    label: 'ミッドナイト',
    dotClassName: 'bg-violet-300',
    badgeClassName: 'bg-violet-400/14 text-violet-100',
    cardClassName:
      'border-white/10 bg-[linear-gradient(180deg,rgba(104,87,197,0.26)_0%,rgba(17,20,34,0.94)_100%)] shadow-[0_18px_40px_rgba(39,25,82,0.26)]',
    softSurfaceClassName: 'border-violet-200/15 bg-violet-300/10 text-violet-50',
    ringClassName: 'ring-violet-300/60',
  },
  emerald: {
    label: 'モス',
    dotClassName: 'bg-emerald-300',
    badgeClassName: 'bg-emerald-400/14 text-emerald-100',
    cardClassName:
      'border-white/10 bg-[linear-gradient(180deg,rgba(45,109,93,0.3)_0%,rgba(16,22,23,0.96)_100%)] shadow-[0_18px_40px_rgba(12,62,48,0.24)]',
    softSurfaceClassName: 'border-emerald-200/15 bg-emerald-300/10 text-emerald-50',
    ringClassName: 'ring-emerald-300/60',
  },
  amber: {
    label: 'アンバー',
    dotClassName: 'bg-amber-300',
    badgeClassName: 'bg-amber-400/16 text-amber-100',
    cardClassName:
      'border-white/10 bg-[linear-gradient(180deg,rgba(130,90,28,0.3)_0%,rgba(24,18,12,0.96)_100%)] shadow-[0_18px_40px_rgba(88,55,8,0.24)]',
    softSurfaceClassName: 'border-amber-200/15 bg-amber-300/10 text-amber-50',
    ringClassName: 'ring-amber-300/60',
  },
  rose: {
    label: 'ローズ',
    dotClassName: 'bg-rose-300',
    badgeClassName: 'bg-rose-400/16 text-rose-100',
    cardClassName:
      'border-white/10 bg-[linear-gradient(180deg,rgba(132,55,83,0.3)_0%,rgba(26,16,22,0.96)_100%)] shadow-[0_18px_40px_rgba(74,20,40,0.22)]',
    softSurfaceClassName: 'border-rose-200/15 bg-rose-300/10 text-rose-50',
    ringClassName: 'ring-rose-300/60',
  },
  slate: {
    label: 'スレート',
    dotClassName: 'bg-sky-200',
    badgeClassName: 'bg-sky-300/14 text-sky-50',
    cardClassName:
      'border-white/10 bg-[linear-gradient(180deg,rgba(68,93,119,0.24)_0%,rgba(16,20,28,0.96)_100%)] shadow-[0_18px_40px_rgba(18,30,47,0.24)]',
    softSurfaceClassName: 'border-slate-200/15 bg-slate-200/10 text-slate-50',
    ringClassName: 'ring-sky-200/60',
  },
};

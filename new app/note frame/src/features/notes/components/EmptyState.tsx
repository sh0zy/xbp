import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,21,34,0.94),rgba(10,12,18,0.94))] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mx-auto h-20 w-20 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]" />
      <h2 className="mt-4 font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/62">{description}</p>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

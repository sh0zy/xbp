import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="card-hl px-5 py-8 text-center">
      <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <h3 className="text-[15px] text-ink-base font-medium mb-1">{title}</h3>
      {description && <p className="text-[13px] text-ink-mute leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

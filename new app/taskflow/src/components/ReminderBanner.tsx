import type { ReactNode } from "react";

type Props = {
  tone: "evening" | "morning";
  title: string;
  description: string;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  icon?: ReactNode;
};

export function ReminderBanner({ tone, title, description, primary, secondary, icon }: Props) {
  const grad =
    tone === "evening"
      ? "from-indigo-500/25 via-violet-500/15 to-transparent"
      : "from-amber-400/15 via-rose-400/10 to-transparent";
  return (
    <div className={`card-hl p-4 bg-gradient-to-br ${grad}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-line/70 flex items-center justify-center shrink-0">
          {icon ?? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-accent">
              <path d="M12 3v9l5 3" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-ink-base">{title}</h3>
          <p className="text-[13px] text-ink-mute mt-1 leading-relaxed">{description}</p>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary btn-sm" onClick={primary.onClick}>
              {primary.label}
            </button>
            {secondary && (
              <button className="btn-ghost btn-sm" onClick={secondary.onClick}>
                {secondary.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

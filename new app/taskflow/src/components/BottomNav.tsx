import type { ScreenName } from "../types";

type Item = { id: ScreenName; label: string; icon: JSX.Element };

const Icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
      <path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  tasks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    </svg>
  ),
  focus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
      <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M8 12h8M8 16h6" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.7A7 7 0 0 0 7.4 6.9l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.7c.8-.3 1.5-.7 2.1-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
    </svg>
  ),
};

const items: Item[] = [
  { id: "home", label: "ホーム", icon: Icon.home },
  { id: "tasks", label: "タスク", icon: Icon.tasks },
  { id: "focus", label: "集中", icon: Icon.focus },
  { id: "review", label: "ふりかえり", icon: Icon.review },
  { id: "settings", label: "設定", icon: Icon.settings },
];

export function BottomNav({
  current,
  onChange,
}: {
  current: ScreenName;
  onChange: (s: ScreenName) => void;
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-md px-3 pb-2 safe-pb pointer-events-auto">
        <div className="bg-bg-card/85 backdrop-blur-xl border border-line/70 rounded-2xl shadow-card px-2 py-2 flex justify-between">
          {items.map((it) => {
            const active = current === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onChange(it.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition ${
                  active ? "text-white bg-accent/15" : "text-ink-dim hover:text-ink-mute"
                }`}
                aria-label={it.label}
              >
                <span
                  className={`transition ${active ? "text-accent drop-shadow-[0_0_6px_rgba(124,108,255,0.7)]" : ""}`}
                >
                  {it.icon}
                </span>
                <span className="text-[10px] tracking-wider">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

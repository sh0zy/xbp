import type { Screen } from "../types";

type Props = {
  current: Screen;
  onChange: (s: Screen) => void;
};

const items: { key: Screen; label: string; icon: string }[] = [
  { key: "home", label: "ホーム", icon: "▣" },
  { key: "inbox", label: "受信箱", icon: "☰" },
  { key: "add", label: "追加", icon: "＋" },
  { key: "calendar", label: "カレンダー", icon: "▦" },
  { key: "settings", label: "設定", icon: "✦" },
];

export function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed left-0 right-0 bottom-0 z-40">
      <div className="mx-auto max-w-xl px-4 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="glass-strong mb-3 rounded-3xl px-2 py-2 flex items-center justify-between">
          {items.map((it) => {
            const active = current === it.key;
            const isAdd = it.key === "add";
            if (isAdd) {
              return (
                <button
                  key={it.key}
                  aria-label={it.label}
                  onClick={() => onChange(it.key)}
                  className="relative -mt-8 mx-1 h-14 w-14 rounded-full bg-gradient-to-b from-accent-500 to-accent-600 text-white text-2xl shadow-[0_12px_30px_-10px_rgba(61,107,255,0.7)] active:scale-95 transition flex items-center justify-center"
                >
                  {it.icon}
                </button>
              );
            }
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition ${
                  active ? "text-accent-400" : "text-white/50"
                }`}
              >
                <span className="text-lg leading-none">{it.icon}</span>
                <span className="text-[10px] tracking-wide">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

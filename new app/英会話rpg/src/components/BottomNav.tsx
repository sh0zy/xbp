import { BarChart3, Home, Map, Settings, Sword, Wand2 } from "lucide-react";
import clsx from "clsx";
import type { ScreenId } from "../types";

const items: Array<{ id: ScreenId; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "map", label: "Map", icon: Map },
  { id: "equipment", label: "Gear", icon: Sword },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "AI", icon: Settings },
];

export default function BottomNav({ current, onNavigate }: { current: ScreenId; onNavigate: (screen: ScreenId) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t-2 border-[#fff6d0] bg-[#050914]/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto grid max-w-[420px] grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon === Sword && current === "battle" ? Wand2 : item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded border text-[11px] font-bold transition",
                active ? "border-[#fff6d0] bg-[#ffd56b] text-ink" : "border-white/20 bg-[#082e7e] text-white hover:border-[#fff6d0]",
              )}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={2.4} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

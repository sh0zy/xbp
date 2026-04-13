import { NavLink } from "react-router-dom";
import { Home, ListChecks, History, BarChart3, Settings } from "lucide-react";
import clsx from "clsx";

const items = [
  { to: "/home", label: "ホーム", icon: Home },
  { to: "/plan", label: "計画", icon: ListChecks },
  { to: "/history", label: "履歴", icon: History },
  { to: "/analytics", label: "分析", icon: BarChart3 },
  { to: "/settings", label: "設定", icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-ink-800/95 backdrop-blur border-t border-ink-500/40 safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center py-2.5 text-[11px] gap-1 transition",
                isActive ? "text-accent" : "text-slate-400"
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { NavLink } from "react-router-dom";
import { classNames } from "../../lib/utils";

interface TabItem {
  to: string;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { to: "/", label: "ホーム", icon: "🏠" },
  { to: "/start", label: "始める", icon: "▶️" },
  { to: "/templates", label: "テンプレ", icon: "🗂️" },
  { to: "/history", label: "履歴", icon: "📜" },
  { to: "/settings", label: "設定", icon: "⚙️" },
];

export function BottomTabBar() {
  return (
    <nav className="safe-pb fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-white/95 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/95">
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-between px-2">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                classNames(
                  "flex h-16 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium tap-highlight-none",
                  isActive
                    ? "text-brand-600 dark:text-brand-300"
                    : "text-ink-400 dark:text-ink-400",
                )
              }
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

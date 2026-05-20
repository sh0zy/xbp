import { useLocation } from "react-router-dom";

const PATH_TITLES: Record<string, string> = {
  "/": "3-Minute Start",
  "/start": "3分だけ始める",
  "/templates": "テンプレ",
  "/history": "履歴",
  "/settings": "設定",
};

export function TopBar() {
  const location = useLocation();
  const title = PATH_TITLES[location.pathname] ?? "3-Minute Start";

  return (
    <header className="safe-pt sticky top-0 z-20 border-b border-ink-100 bg-white/85 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/80">
      <div className="mx-auto flex h-12 w-full max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-soft">
            3
          </span>
          <h1 className="text-base font-semibold tracking-tight text-ink-800 dark:text-ink-100">
            {title}
          </h1>
        </div>
        <span className="text-xs text-ink-400 dark:text-ink-400">
          まず3分だけ
        </span>
      </div>
    </header>
  );
}

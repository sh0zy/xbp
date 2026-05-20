import type { TaskTemplate } from "../../../types/app";
import { COLOR_BG, classNames } from "../../../lib/utils";

interface TemplateCardProps {
  template: TaskTemplate;
  onClick?: () => void;
  compact?: boolean;
}

export function TemplateCard({
  template,
  onClick,
  compact = false,
}: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "tap-highlight-none flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-soft ring-1 ring-ink-100 transition active:scale-[0.99] dark:bg-ink-800 dark:ring-ink-700",
        compact ? "py-2.5" : "",
      )}
    >
      <span
        className={classNames(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl",
          COLOR_BG[template.colorKey],
        )}
      >
        {template.icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">
          {template.title}
        </span>
        <span className="truncate text-xs text-ink-500 dark:text-ink-400">
          {template.firstStepOptions[0] ?? "最初の1歩を選んで始めよう"}
        </span>
      </span>
    </button>
  );
}

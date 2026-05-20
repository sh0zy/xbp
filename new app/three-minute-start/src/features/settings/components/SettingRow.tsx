import type { ReactNode } from "react";

interface SettingRowProps {
  title: string;
  description?: string;
  control: ReactNode;
}

export function SettingRow({ title, description, control }: SettingRowProps) {
  return (
    <div className="flex min-h-[64px] items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-end">{control}</div>
    </div>
  );
}

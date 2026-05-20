import type { StartSession } from "../../../types/app";
import { Card } from "../../../components/common/Card";
import {
  classNames,
  formatDateTime,
  formatTime,
  relativeTime,
} from "../../../lib/utils";

interface SessionListProps {
  sessions: StartSession[];
  onRemove?: (id: string) => void;
}

const STATUS_LABEL: Record<StartSession["status"], string> = {
  idle: "待機",
  running: "実行中",
  completed_3min: "3分達成",
  stopped_early: "途中で止めた",
  extended: "もう3分続けた",
  continued_open: "そのまま継続",
};

const STATUS_STYLE: Record<StartSession["status"], string> = {
  idle: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
  running:
    "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  completed_3min:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  stopped_early:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  extended:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  continued_open:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
};

export function SessionList({ sessions, onRemove }: SessionListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {sessions.map((s) => {
        const totalSec = s.baseDurationSec + s.extraDurationSec;
        return (
          <li key={s.id}>
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={classNames(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        STATUS_STYLE[s.status],
                      )}
                    >
                      {STATUS_LABEL[s.status]}
                    </span>
                    <span className="text-[11px] text-ink-400 dark:text-ink-400">
                      {relativeTime(s.startedAt)}
                    </span>
                  </div>
                  <h4 className="mt-1.5 truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
                    {s.taskLabel || "(無題の作業)"}
                  </h4>
                  <p className="truncate text-xs text-ink-500 dark:text-ink-400">
                    最初の1歩: {s.chosenFirstStep}
                  </p>
                  <div className="mt-1 text-[11px] text-ink-400 dark:text-ink-400">
                    {formatDateTime(s.startedAt)} ・ {formatTime(totalSec)}
                  </div>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    className="rounded-lg p-2 text-xs text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
                    aria-label="削除"
                  >
                    ✕
                  </button>
                )}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

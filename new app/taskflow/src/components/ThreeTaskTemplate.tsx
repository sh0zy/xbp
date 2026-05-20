import { useState } from "react";
import type { Task } from "../types";
import { getTomorrowDateString, nowIso } from "../utils/date";
import { genId } from "../utils/storage";

type Row = { title: string };

const ROWS: Array<{ label: string; placeholder: string; priority: Task["priority"] }> = [
  { label: "明日必ずやること", placeholder: "例) 英語課題を1問でも解く", priority: "高" },
  { label: "できればやること", placeholder: "例) SPI非言語を15分", priority: "中" },
  { label: "5分だけでも進めること", placeholder: "例) 部屋を片付ける", priority: "低" },
];

export function ThreeTaskTemplate({ onSubmit }: { onSubmit: (tasks: Task[]) => void }) {
  const [rows, setRows] = useState<Row[]>([{ title: "" }, { title: "" }, { title: "" }]);

  const submit = () => {
    const tomorrow = getTomorrowDateString();
    const tasks: Task[] = rows
      .map((r, i) => ({ row: r, meta: ROWS[i] }))
      .filter(({ row }) => row.title.trim().length > 0)
      .map(({ row, meta }) => ({
        id: genId(),
        title: row.title.trim(),
        memo: "",
        category: "その他" as const,
        priority: meta.priority,
        status: "未着手" as const,
        dueDate: tomorrow,
        estimatedMinutes: 15 as const,
        isToday: false,
        planningSource: "前日" as const,
        plannedForDate: tomorrow,
        createdAt: nowIso(),
      }));
    if (tasks.length === 0) return;
    onSubmit(tasks);
    setRows([{ title: "" }, { title: "" }, { title: "" }]);
  };

  const filled = rows.some((r) => r.title.trim().length > 0);

  return (
    <div className="space-y-3">
      {ROWS.map((meta, i) => (
        <div key={i}>
          <div className="text-[11px] text-ink-dim mb-1.5 flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-accent/15 text-accent items-center justify-center text-[11px] font-semibold">
              {i + 1}
            </span>
            <span>{meta.label}</span>
            <span className="ml-auto chip">優先 {meta.priority}</span>
          </div>
          <input
            value={rows[i]?.title ?? ""}
            onChange={(e) => {
              const next = rows.slice();
              next[i] = { title: e.target.value };
              setRows(next);
            }}
            placeholder={meta.placeholder}
            className="field"
          />
        </div>
      ))}
      <button className="btn-primary w-full" onClick={submit} disabled={!filled}>
        明日のToDoを保存する
      </button>
      <p className="text-[11px] text-ink-dim text-center">
        空欄の行は保存されません。1つだけでも大丈夫です。
      </p>
    </div>
  );
}

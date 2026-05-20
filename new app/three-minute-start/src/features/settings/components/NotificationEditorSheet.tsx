import { useEffect, useState } from "react";
import { PrimaryButton } from "../../../components/common/PrimaryButton";

interface NotificationEditorSheetProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    hour: number;
    minute: number;
    label?: string;
  }) => void;
  initial?: { hour: number; minute: number; label?: string };
}

const PRESETS = [
  { hour: 7, minute: 0, label: "朝" },
  { hour: 9, minute: 0, label: "午前" },
  { hour: 13, minute: 0, label: "昼休み後" },
  { hour: 17, minute: 0, label: "夕方" },
  { hour: 21, minute: 0, label: "夜" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function NotificationEditorSheet({
  open,
  onClose,
  onCreate,
  initial,
}: NotificationEditorSheetProps) {
  const [hour, setHour] = useState(21);
  const [minute, setMinute] = useState(0);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (open) {
      setHour(initial?.hour ?? 21);
      setMinute(initial?.minute ?? 0);
      setLabel(initial?.label ?? "");
    }
  }, [open, initial]);

  if (!open) return null;

  const timeStr = `${pad(hour)}:${pad(minute)}`;

  function applyPreset(p: { hour: number; minute: number; label: string }) {
    setHour(p.hour);
    setMinute(p.minute);
    if (!label) setLabel(p.label);
  }

  function handleSave() {
    onCreate({ hour, minute, label: label.trim() || undefined });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="safe-pb max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft dark:bg-ink-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-800 dark:text-ink-100">
            通知を追加
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-ink-500 dark:text-ink-400">
          指定した時刻に毎日「3分だけ始めませんか？」と通知します。
        </p>

        <div className="mt-4">
          <label className="text-xs font-medium text-ink-500 dark:text-ink-400">
            時刻
          </label>
          <div className="mt-1">
            <input
              type="time"
              value={timeStr}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map((v) => parseInt(v, 10));
                if (!Number.isNaN(h)) setHour(Math.min(23, Math.max(0, h)));
                if (!Number.isNaN(m)) setMinute(Math.min(59, Math.max(0, m)));
              }}
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-2xl font-mono tabular-nums outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={`${p.hour}-${p.minute}`}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-ink-600"
              >
                {p.label} {pad(p.hour)}:{pad(p.minute)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-ink-500 dark:text-ink-400">
            ラベル（任意）
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="例: 夜のひと声"
            className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <PrimaryButton fullWidth size="lg" onClick={handleSave}>
            追加する
          </PrimaryButton>
          <PrimaryButton fullWidth size="md" variant="ghost" onClick={onClose}>
            キャンセル
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

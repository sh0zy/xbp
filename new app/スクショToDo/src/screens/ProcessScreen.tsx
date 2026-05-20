import { useMemo, useState } from "react";
import type { ActionStatus, LaterItem } from "../types";
import { Header } from "../components/Header";

type Props = {
  items: LaterItem[];
  onDone: () => void;
  onUpdateStatus: (id: string, status: ActionStatus) => void;
  onDelete: (id: string) => void;
};

const BUILTIN_BUTTONS: { key: string; label: string; tone: string }[] = [
  { key: "today", label: "今日やる", tone: "from-accent-500 to-accent-600 text-white" },
  { key: "week", label: "今週やる", tone: "from-sky-500/80 to-sky-600/80 text-white" },
  { key: "done", label: "完了", tone: "from-emerald-500/80 to-emerald-600/80 text-white" },
  { key: "__delete", label: "消す", tone: "from-rose-500/80 to-rose-600/80 text-white" },
  { key: "__later", label: "あとで", tone: "from-white/10 to-white/5 text-white/80" },
  { key: "archive", label: "アーカイブ", tone: "from-gold-400/90 to-gold-500/80 text-ink-950" },
];

export function ProcessScreen({
  items,
  onDone,
  onUpdateStatus,
  onDelete,
}: Props) {
  // Snapshot the ids present when the session started so the cursor stays stable
  // even as items change status and leave the unprocessed pool.
  const [snapshotIds] = useState<string[]>(() =>
    items.filter((i) => i.actionStatus === "unprocessed").map((i) => i.id)
  );
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const remainingItems = useMemo(() => {
    const byId = new Map(items.map((i) => [i.id, i]));
    return snapshotIds
      .map((id) => byId.get(id))
      .filter(
        (it): it is LaterItem =>
          !!it && it.actionStatus === "unprocessed" && !skipped.has(it.id)
      );
  }, [items, snapshotIds, skipped]);

  const current = remainingItems[0];
  const total = snapshotIds.length;
  const done = total - remainingItems.length;

  const buttons = BUILTIN_BUTTONS;

  if (!current) {
    return (
      <div className="px-5 pb-32">
        <Header subtitle="Process" title="3分処理モード" />
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">✦</div>
          <div className="text-lg font-semibold text-white/90 mb-1">
            未整理のスクショはありません
          </div>
          <div className="text-sm text-white/50 mb-6">
            {total > 0
              ? `${total}件すべて行動に変換しました`
              : "保存したスクショは全て行動に変わっています"}
          </div>
          <button className="btn-primary" onClick={onDone}>
            ホームへ戻る
          </button>
        </div>
      </div>
    );
  }

  function act(key: string) {
    if (!current) return;
    if (key === "__delete") onDelete(current.id);
    else if (key === "__later") {
      setSkipped((prev) => new Set(prev).add(current.id));
    } else {
      onUpdateStatus(current.id, key);
    }
  }

  return (
    <div className="px-5 pb-32">
      <Header
        subtitle="Process"
        title={`3分処理 (残り ${remainingItems.length} / ${total})`}
      />

      <div className="card p-0 overflow-hidden">
        <div className="bg-black/40 aspect-[4/5] grid place-items-center">
          {current.image ? (
            <img src={current.image} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="text-white/20 text-6xl">▤</div>
          )}
        </div>
        <div className="p-4">
          {current.dueDate && <span className="chip mb-2">期限: {current.dueDate}</span>}
          <div className="text-lg font-semibold text-white/95 leading-snug">
            {current.title}
          </div>
          {current.content && (
            <div className="text-sm text-white/60 mt-2 whitespace-pre-wrap line-clamp-4">
              {current.content}
            </div>
          )}
          {current.url && (
            <div className="text-xs text-accent-400 mt-2 break-all">{current.url}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-5">
        {buttons.map((b) => (
          <button
            key={b.key}
            onClick={() => act(b.key)}
            className={`rounded-2xl py-4 font-semibold bg-gradient-to-b ${b.tone} active:scale-[0.98] transition`}
          >
            {b.label}
          </button>
        ))}
        <button
          onClick={onDone}
          className="rounded-2xl py-4 bg-white/[0.04] border border-white/[0.08] text-white/70 col-span-2"
        >
          終了
        </button>
      </div>

      <div className="mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-accent-500 transition-all"
          style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%` }}
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import type { ActionStatus, LaterItem } from "../types";
import { PRIORITY_LABELS, getStatusLabel } from "../types";
import { Header } from "../components/Header";

type Props = {
  item: LaterItem;
  onEdit: () => void;
  onBack: () => void;
  onUpdateStatus: (id: string, status: ActionStatus) => void;
  onDelete: () => void;
};

export function DetailScreen({
  item,
  onEdit,
  onBack,
  onUpdateStatus,
  onDelete,
}: Props) {
  const [imageOpen, setImageOpen] = useState(false);

  const quickButtons = [
    { key: "today", label: "今日やる" },
    { key: "week", label: "今週やる" },
    { key: "research", label: "調べる" },
    { key: "buy", label: "買う" },
    { key: "reply", label: "返信" },
    { key: "done", label: "完了" },
    { key: "archive", label: "保管" },
  ];

  const createdStr = new Date(item.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="px-5 pb-32">
      <Header
        subtitle="詳細"
        title="スクショを見る"
        right={
          <button
            onClick={onBack}
            className="text-sm text-white/60 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]"
          >
            戻る
          </button>
        }
      />

      {item.image && (
        <button
          onClick={() => setImageOpen(true)}
          className="w-full card p-0 overflow-hidden mb-4 active:scale-[0.995] transition"
        >
          <div className="bg-black/40 grid place-items-center max-h-[60vh]">
            <img
              src={item.image}
              alt=""
              className="w-full max-h-[60vh] object-contain"
            />
          </div>
        </button>
      )}

      <div className="card">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="chip">{getStatusLabel(item.actionStatus)}</span>
          <span className="chip">優先度 {PRIORITY_LABELS[item.priority]}</span>
          {item.dueDate && (
            <span className="chip">
              期限: {item.dueDate}
              {item.dueTime ? ` ${item.dueTime}` : ""}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-white leading-snug break-words">
          {item.title}
        </h2>
        {item.content && (
          <p className="text-sm text-white/70 leading-relaxed mt-3 whitespace-pre-wrap break-words">
            {item.content}
          </p>
        )}
      </div>

      {item.url && (
        <div className="card mt-3">
          <div className="text-[11px] text-white/40 mb-1">URL</div>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm themed-text break-all underline decoration-white/20"
          >
            {item.url}
          </a>
        </div>
      )}

      {item.memo && (
        <div className="card mt-3">
          <div className="text-[11px] text-white/40 mb-1">メモ</div>
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">
            {item.memo}
          </p>
        </div>
      )}

      <div className="text-[11px] text-white/30 mt-3 px-1">
        追加日 {createdStr}
      </div>

      <h3 className="text-sm text-white/70 mt-6 mb-2 px-1">この1枚を行動に</h3>
      <div className="grid grid-cols-3 gap-2">
        {quickButtons.map((b) => {
          const active = item.actionStatus === b.key;
          return (
            <button
              key={b.key}
              onClick={() => onUpdateStatus(item.id, b.key)}
              className={`rounded-2xl py-3 text-sm font-medium transition ${
                active
                  ? "themed-bg themed-text border border-white/10"
                  : "bg-white/[0.04] border border-white/[0.08] text-white/80"
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => {
            if (confirm("このスクショを削除しますか？")) onDelete();
          }}
          className="btn-ghost flex-1 text-rose-300"
        >
          削除
        </button>
        <button onClick={onEdit} className="btn-primary flex-[2]">
          編集する
        </button>
      </div>

      {imageOpen && item.image && (
        <button
          onClick={() => setImageOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 grid place-items-center p-4"
          aria-label="閉じる"
        >
          <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
          <div className="absolute top-4 right-4 text-white/70 text-sm">タップで閉じる</div>
        </button>
      )}
    </div>
  );
}


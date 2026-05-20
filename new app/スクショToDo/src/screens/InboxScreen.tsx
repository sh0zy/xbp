import { useMemo, useState } from "react";
import type { ActionStatus, CustomStatus, LaterItem, Priority } from "../types";
import { BUILTIN_STATUSES, getStatusLabel } from "../types";
import { Header } from "../components/Header";
import { ItemCard } from "../components/ItemCard";

type Props = {
  items: LaterItem[];
  customStatuses: CustomStatus[];
  onAddStatus: (label: string) => void;
  onRemoveStatus: (id: string) => void;
  onOpenItem: (i: LaterItem) => void;
};

type SortKey = "newest" | "due" | "priority";
type View = "timeline" | "grid";

export function InboxScreen({
  items,
  customStatuses,
  onAddStatus,
  onRemoveStatus,
  onOpenItem,
}: Props) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ActionStatus | "all">("all");
  const [prio, setPrio] = useState<Priority | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<View>("timeline");

  const filtered = useMemo(() => {
    const tq = q.trim().toLowerCase();
    let r = items.filter((i) => {
      if (status !== "all" && i.actionStatus !== status) return false;
      if (prio !== "all" && i.priority !== prio) return false;
      if (tq && !(i.title.toLowerCase().includes(tq) || i.content.toLowerCase().includes(tq)))
        return false;
      return true;
    });
    const pw: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    r.sort((a, b) => {
      if (sort === "due") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate < b.dueDate ? -1 : 1;
      }
      if (sort === "priority") return pw[a.priority] - pw[b.priority];
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return r;
  }, [items, q, status, prio, sort]);

  return (
    <div className="px-5 pb-32">
      <Header
        subtitle="Inbox"
        title={`タイムライン (${filtered.length})`}
        right={
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setView("timeline")}
              className={`text-[11px] px-2.5 py-1 rounded-lg ${
                view === "timeline" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              行
            </button>
            <button
              onClick={() => setView("grid")}
              className={`text-[11px] px-2.5 py-1 rounded-lg ${
                view === "grid" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              画
            </button>
          </div>
        }
      />

      <div className="card mb-3 p-2">
        <input
          className="w-full bg-transparent px-3 py-2 text-white placeholder:text-white/30 outline-none"
          placeholder="🔍 キーワードで検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
        <button
          onClick={() => setStatus("all")}
          className={`chip whitespace-nowrap ${status === "all" ? "chip-active" : ""}`}
        >
          すべて
        </button>
        {[...BUILTIN_STATUSES, ...customStatuses.map((c) => c.id)].map((s) => {
          const isCustom = customStatuses.some((c) => c.id === s);
          return (
            <div
              key={s}
              className={`chip whitespace-nowrap cursor-pointer ${
                isCustom ? "pr-1.5" : ""
              } ${status === s ? "chip-active" : ""}`}
              onClick={() => setStatus(s)}
            >
              {getStatusLabel(s, customStatuses)}
              {isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        `「${getStatusLabel(s, customStatuses)}」タブを削除しますか？`
                      )
                    ) {
                      onRemoveStatus(s);
                      if (status === s) setStatus("all");
                    }
                  }}
                  className="ml-1 text-white/40 hover:text-rose-300 px-1"
                  aria-label="削除"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={() => {
            const label = prompt(
              "新しいタブ名を入力してください\n（例: 発表準備 / 返却 / 調整中）"
            );
            if (label && label.trim()) onAddStatus(label.trim());
          }}
          className="chip whitespace-nowrap border-dashed border-white/20 text-white/60"
        >
          ＋ タブ追加
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 mb-4">
        <select
          value={prio}
          onChange={(e) => setPrio(e.target.value as Priority | "all")}
          className="chip bg-white/[0.04] border border-white/[0.08] text-white/80"
        >
          <option value="all">優先度すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="chip bg-white/[0.04] border border-white/[0.08] text-white/80"
        >
          <option value="newest">新しい順</option>
          <option value="due">期限順</option>
          <option value="priority">優先度順</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-sm text-white/40 py-10">
          該当するスクショはありません
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((i) => (
            <GridCard
              key={i.id}
              item={i}
              label={getStatusLabel(i.actionStatus)}
              onClick={() => onOpenItem(i)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((i) => (
            <ItemCard key={i.id} item={i} onClick={onOpenItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function GridCard({
  item,
  label,
  onClick,
}: {
  item: LaterItem;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card p-0 overflow-hidden active:scale-[0.985] transition text-left"
    >
      <div className="aspect-[3/4] bg-black/30 relative">
        {item.image ? (
          <img src={item.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/20 text-3xl">▤</div>
        )}
        <div className="absolute left-2 top-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/90">
            {label}
          </span>
        </div>
      </div>
      <div className="p-2">
        <div className="text-xs font-medium text-white/90 line-clamp-2 leading-snug">
          {item.title}
        </div>
        {item.dueDate && (
          <div className="text-[10px] text-white/40 mt-1">〜 {item.dueDate}</div>
        )}
      </div>
    </button>
  );
}

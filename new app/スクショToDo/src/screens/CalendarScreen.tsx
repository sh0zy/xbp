import { useMemo, useState } from "react";
import type { LaterItem } from "../types";
import { isDoneStatus, getStatusLabel } from "../types";
import { Header } from "../components/Header";
import { ItemCard } from "../components/ItemCard";

type Props = {
  items: LaterItem[];
  onOpenItem: (i: LaterItem) => void;
};

type Tab = "calendar" | "done";

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CalendarScreen({ items, onOpenItem }: Props) {
  const [tab, setTab] = useState<Tab>("calendar");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string>(ymd(new Date()));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: { key: string; date?: string; day?: number }[] = [];
    for (let i = 0; i < startPad; i++) arr.push({ key: `p${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = ymd(new Date(year, month, d));
      arr.push({ key: date, date, day: d });
    }
    while (arr.length % 7 !== 0) arr.push({ key: `n${arr.length}` });
    return arr;
  }, [year, month]);

  const byDate = useMemo(() => {
    const map = new Map<string, LaterItem[]>();
    for (const i of items) {
      if (!i.dueDate) continue;
      if (!map.has(i.dueDate)) map.set(i.dueDate, []);
      map.get(i.dueDate)!.push(i);
    }
    return map;
  }, [items]);

  const selectedItems = (byDate.get(selected) ?? []).sort((a, b) => {
    const ta = a.dueTime ?? "99:99";
    const tb = b.dueTime ?? "99:99";
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  const doneItems = useMemo(
    () =>
      items
        .filter((i) => isDoneStatus(i.actionStatus))
        .sort((a, b) =>
          (b.processedAt ?? b.updatedAt) < (a.processedAt ?? a.updatedAt) ? -1 : 1
        ),
    [items]
  );

  const monthLabel = `${year}年 ${month + 1}月`;
  const todayStr = ymd(new Date());

  return (
    <div className="px-5 pb-32">
      <Header
        subtitle="Calendar"
        title="カレンダー"
        right={
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setTab("calendar")}
              className={`text-[11px] px-2.5 py-1 rounded-lg ${
                tab === "calendar" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              月
            </button>
            <button
              onClick={() => setTab("done")}
              className={`text-[11px] px-2.5 py-1 rounded-lg ${
                tab === "done" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              完了
            </button>
          </div>
        }
      />

      {tab === "calendar" ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <button
              className="chip"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              ‹
            </button>
            <div className="text-sm text-white/80">{monthLabel}</div>
            <button
              className="chip"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              ›
            </button>
          </div>

          <div className="card p-3">
            <div className="grid grid-cols-7 text-[10px] text-white/40 mb-1">
              {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
                <div key={w} className="text-center">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((c) => {
                if (!c.date) return <div key={c.key} className="aspect-square" />;
                const list = byDate.get(c.date) ?? [];
                const hasUndone = list.some((i) => !isDoneStatus(i.actionStatus));
                const isToday = c.date === todayStr;
                const isSel = c.date === selected;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelected(c.date!)}
                    className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition ${
                      isSel
                        ? "themed-bg themed-text"
                        : isToday
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{c.day}</span>
                    {list.length > 0 && (
                      <span
                        className={`h-1 w-1 rounded-full ${
                          hasUndone ? "bg-accent-400" : "bg-white/30"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="text-sm text-white/70 mt-5 mb-2 px-1">
            {selected} の予定 ({selectedItems.length})
          </h3>
          {selectedItems.length === 0 ? (
            <div className="card text-center text-sm text-white/40 py-8">
              この日は予定がありません
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedItems.map((i) => (
                <div key={i.id} className="relative">
                  {i.dueTime && (
                    <div className="absolute -top-1 right-2 z-10 text-[10px] px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-white/80">
                      {i.dueTime}
                    </div>
                  )}
                  <ItemCard
                    item={i}
                   
                    onClick={onOpenItem}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card mb-3">
            <div className="text-xs text-white/50">完了した数</div>
            <div className="text-3xl font-semibold text-gold-400 mt-1">
              {doneItems.length}
              <span className="text-sm text-white/40 ml-2">件</span>
            </div>
            <div className="text-[11px] text-white/40 mt-1">
              完了・アーカイブ・忘れてよいを含む
            </div>
          </div>

          {doneItems.length === 0 ? (
            <div className="card text-center text-sm text-white/40 py-10">
              完了したスクショはまだありません
            </div>
          ) : (
            <div className="space-y-2.5">
              {doneItems.map((i) => (
                <div key={i.id} className="relative">
                  <div className="absolute -top-1 right-2 z-10 text-[10px] px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-white/80">
                    {getStatusLabel(i.actionStatus)}
                  </div>
                  <ItemCard
                    item={i}
                   
                    onClick={onOpenItem}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import type { LaterItem } from "../types";
import { Header } from "../components/Header";
import { ItemCard } from "../components/ItemCard";

type Props = {
  items: LaterItem[];
  onAdd: () => void;
  onStartProcess: () => void;
  onOpenItem: (item: LaterItem) => void;
};

function inNextDays(dueDate: string | undefined, days: number): boolean {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days && diff >= -1;
}

export function HomeScreen({ items, onAdd, onStartProcess, onOpenItem }: Props) {
  const today = items.filter((i) => i.actionStatus === "today");
  const unprocessed = items.filter((i) => i.actionStatus === "unprocessed");
  const upcoming = items
    .filter((i) => i.dueDate && inNextDays(i.dueDate, 7) && i.actionStatus !== "archive")
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
  const recent = [...items]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3);

  const dateStr = new Date().toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const total = items.length || 1;
  const actionable =
    items.filter((i) => i.actionStatus !== "unprocessed" && i.actionStatus !== "forget")
      .length;
  const rate = Math.round((actionable / total) * 100);

  return (
    <div className="px-5 pb-32">
      <Header subtitle={dateStr} title="今日の行動" />

      <button
        onClick={onAdd}
        className="w-full btn-primary py-5 text-base rounded-3xl mb-4 shadow-[0_16px_40px_-12px_rgba(61,107,255,0.6)]"
      >
        ＋ スクショを保存
      </button>

      <div className="card">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/50">行動化率</div>
          <div className="text-xs text-white/40">{actionable}/{items.length}件</div>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <div className="text-3xl font-semibold text-gold-400">{rate}%</div>
          <div className="text-xs text-white/40 pb-1.5">保存だけで終わらせない</div>
        </div>
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat label="今日" value={today.length} tone="accent" />
        <Stat label="未整理" value={unprocessed.length} tone="rose" />
        <Stat label="期限間近" value={upcoming.length} tone="gold" />
      </div>

      {unprocessed.length > 0 && (
        <button
          onClick={onStartProcess}
          className="w-full mt-5 btn-gold py-4 rounded-3xl"
        >
          3分で {unprocessed.length} 枚を行動に変える →
        </button>
      )}

      <Section title="今日やるスクショ" empty={today.length === 0 ? "「今日やる」はまだありません" : undefined}>
        {today.map((i) => (
          <ItemCard key={i.id} item={i} onClick={onOpenItem} />
        ))}
      </Section>

      <Section title="期限が近い" empty={upcoming.length === 0 ? "期限付きはありません" : undefined}>
        {upcoming.slice(0, 5).map((i) => (
          <ItemCard key={i.id} item={i} onClick={onOpenItem} />
        ))}
      </Section>

      <Section title="最近追加" empty={recent.length === 0 ? "保存されたスクショはありません" : undefined}>
        {recent.map((i) => (
          <ItemCard key={i.id} item={i} onClick={onOpenItem} />
        ))}
      </Section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "accent" | "gold" | "rose" }) {
  const color =
    tone === "accent"
      ? "text-accent-400"
      : tone === "gold"
      ? "text-gold-400"
      : "text-rose-300";
  return (
    <div className="card py-3 text-center">
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="text-[11px] text-white/50 mt-0.5">{label}</div>
    </div>
  );
}

function Section({
  title,
  children,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <div className="mt-7">
      <h2 className="text-sm font-medium text-white/80 mb-3 px-1">{title}</h2>
      {empty ? (
        <div className="card text-center text-sm text-white/40 py-6">{empty}</div>
      ) : (
        <div className="space-y-2.5">{children}</div>
      )}
    </div>
  );
}

import type { LaterItem } from "../types";
import { getStatusLabel, PRIORITY_LABELS } from "../types";

type Props = {
  item: LaterItem;
  onClick?: (item: LaterItem) => void;
};

const statusColor: Record<string, string> = {
  today: "text-accent-400 bg-accent-500/20 border-accent-400/40",
  week: "text-sky-300 bg-sky-400/15 border-sky-400/40",
  research: "text-violet-300 bg-violet-400/15 border-violet-400/40",
  buy: "text-emerald-300 bg-emerald-400/15 border-emerald-400/40",
  reply: "text-pink-300 bg-pink-400/15 border-pink-400/40",
  forget: "text-white/40 bg-white/5 border-white/10",
  archive: "text-gold-400 bg-gold-500/15 border-gold-500/40",
  unprocessed: "text-white bg-rose-500/25 border-rose-400/40",
};

const customColor = "text-gold-400 bg-gold-500/10 border-gold-500/30";

const priorityDot: Record<string, string> = {
  high: "bg-rose-400",
  medium: "bg-amber-300",
  low: "bg-emerald-300",
};

export function ItemCard({ item, onClick }: Props) {
  const chipColor = statusColor[item.actionStatus] ?? customColor;
  const statusLabel = getStatusLabel(item.actionStatus);

  return (
    <button
      onClick={() => onClick?.(item)}
      className="w-full text-left card overflow-hidden p-0 hover:bg-white/[0.05] transition active:scale-[0.995]"
    >
      <div className="flex gap-0">
        <div className="w-28 h-32 flex-shrink-0 bg-black/30 relative">
          {item.image ? (
            <img src={item.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-white/20 text-2xl">
              ▤
            </div>
          )}
          <div className={`absolute top-1.5 left-1.5 w-2 h-2 rounded-full ${priorityDot[item.priority]}`} />
        </div>
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`chip border ${chipColor} !py-1 !px-2.5`}>
                {statusLabel}
              </span>
              {item.dueDate && (
                <span className="text-[11px] text-white/50">
                  〜 {item.dueDate}
                  {item.dueTime ? ` ${item.dueTime}` : ""}
                </span>
              )}
            </div>
            <div className="font-semibold text-white/95 text-sm leading-snug line-clamp-2">
              {item.title}
            </div>
            {item.content && (
              <div className="text-[11px] text-white/50 mt-1 line-clamp-2">{item.content}</div>
            )}
          </div>
          <div className="text-[10px] text-white/30 mt-1">
            優先度 {PRIORITY_LABELS[item.priority]}
          </div>
        </div>
      </div>
    </button>
  );
}

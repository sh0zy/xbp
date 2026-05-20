import type { ColorKey } from "../types/app";

export function classNames(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function generateId(prefix = "id"): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rnd}`;
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const mo = (d.getMonth() + 1).toString().padStart(2, "0");
  const da = d.getDate().toString().padStart(2, "0");
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${y}/${mo}/${da} ${hh}:${mm}`;
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "今さっき";
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}日前`;
  return formatDateTime(ts);
}

export const COLOR_BG: Record<ColorKey, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

export const COLOR_RING: Record<ColorKey, string> = {
  blue: "ring-blue-300 dark:ring-blue-700",
  violet: "ring-violet-300 dark:ring-violet-700",
  pink: "ring-pink-300 dark:ring-pink-700",
  teal: "ring-teal-300 dark:ring-teal-700",
  amber: "ring-amber-300 dark:ring-amber-700",
  lime: "ring-lime-300 dark:ring-lime-700",
  rose: "ring-rose-300 dark:ring-rose-700",
  slate: "ring-slate-300 dark:ring-slate-600",
};

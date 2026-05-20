export type Priority = "low" | "medium" | "high";

// Built-in action statuses. actionStatus on an item is a string so user-defined
// custom statuses (identified by a generated id) can coexist with these.
export const BUILTIN_STATUSES = [
  "unprocessed",
  "today",
  "week",
  "research",
  "buy",
  "reply",
  "done",
  "forget",
  "archive",
] as const;

export type BuiltinStatus = (typeof BUILTIN_STATUSES)[number];
export type ActionStatus = string;

export const ACTION_LABELS: Record<BuiltinStatus, string> = {
  unprocessed: "未整理",
  today: "今日やる",
  week: "今週やる",
  research: "調べる",
  buy: "買う",
  reply: "返信する",
  done: "完了",
  forget: "忘れてよい",
  archive: "アーカイブ",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export type CustomStatus = { id: string; label: string };

export function getStatusLabel(id: string, custom: CustomStatus[] = []): string {
  if (id in ACTION_LABELS) return ACTION_LABELS[id as BuiltinStatus];
  return custom.find((c) => c.id === id)?.label ?? id;
}

export function isDoneStatus(id: string): boolean {
  return id === "done" || id === "archive" || id === "forget";
}

export type LaterItem = {
  id: string;
  title: string;
  content: string;
  image?: string;
  priority: Priority;
  dueDate?: string;
  dueTime?: string;
  memo?: string;
  url?: string;
  actionStatus: ActionStatus;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
};

export type ThemeId = "midnight" | "forest" | "wine";

export const THEMES: { id: ThemeId; name: string; swatch: string }[] = [
  { id: "midnight", name: "ミッドナイト", swatch: "from-ink-900 to-accent-500" },
  { id: "forest", name: "フォレスト", swatch: "from-emerald-900 to-emerald-500" },
  { id: "wine", name: "ワイン", swatch: "from-rose-900 to-gold-500" },
];

export type Screen =
  | "home"
  | "inbox"
  | "add"
  | "process"
  | "calendar"
  | "settings"
  | "detail";

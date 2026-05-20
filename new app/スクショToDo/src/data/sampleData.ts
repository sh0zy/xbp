import type { LaterItem } from "../types";
import { uid } from "../utils/storage";

function daysFromNow(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
}

// Small 16x9 gradient placeholder so the screenshot-centric UI has visual substance
// even before the user attaches their first screenshot. No external assets required.
function makePlaceholder(hue: number): string {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue}, 40%, 14%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 40) % 360}, 60%, 8%)"/>
    </linearGradient>
  </defs>
  <rect width="360" height="640" fill="url(#g)"/>
  <rect x="28" y="90" width="304" height="18" rx="9" fill="rgba(255,255,255,0.12)"/>
  <rect x="28" y="120" width="220" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
  <rect x="28" y="170" width="304" height="120" rx="16" fill="rgba(255,255,255,0.05)"/>
  <rect x="28" y="310" width="180" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
  <rect x="28" y="330" width="260" height="12" rx="6" fill="rgba(255,255,255,0.06)"/>
  <rect x="28" y="350" width="200" height="12" rx="6" fill="rgba(255,255,255,0.06)"/>
  <rect x="28" y="530" width="304" height="48" rx="24" fill="rgba(138,180,255,0.22)"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function buildSampleData(): LaterItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid(),
      title: "夏インターンESの締切",
      content: "第一志望の夏インターン。設問3つ・ガクチカ見直し。",
      image: makePlaceholder(220),
      priority: "high",
      dueDate: daysFromNow(3),
      memo: "先輩のESを参考にする",
      actionStatus: "today",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "TOEIC単語帳の比較",
      content: "金のフレーズ vs 銀のフレーズ。レビュー要確認。",
      image: makePlaceholder(30),
      priority: "medium",
      actionStatus: "research",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "統計学レポートの提出",
      content: "設問4。図表必須。",
      image: makePlaceholder(160),
      priority: "high",
      dueDate: daysFromNow(5),
      actionStatus: "week",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "気になったカフェの保存",
      content: "表参道のスペシャルティコーヒー。テスト後に行く。",
      image: makePlaceholder(340),
      priority: "low",
      url: "https://example.com/cafe",
      actionStatus: "unprocessed",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "アプリ案のスクショ",
      content: "学習管理・就活メモ・スクショ行動化。",
      image: makePlaceholder(270),
      priority: "medium",
      actionStatus: "unprocessed",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

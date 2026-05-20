import { useState } from "react";

type Props = { onDone: () => void };

const SLIDES = [
  {
    icon: "▤",
    title: "スクショを保存",
    body: "端末の画像からスクショを選ぶだけ。カメラロール権限は使いません。",
  },
  {
    icon: "→",
    title: "行動に変換",
    body: "今日やる / 今週やる / 調べる / 買う / 返信する などの行動ステータスに振り分けます。",
  },
  {
    icon: "✦",
    title: "3分処理モード",
    body: "溜まった未整理スクショを1枚ずつ高速で片付けられます。",
  },
  {
    icon: "◎",
    title: "行動化率を可視化",
    body: "保存して終わりにせず、実際に行動に変えた割合がひと目で分かります。",
  },
];

export function Tutorial({ onDone }: Props) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const s = SLIDES[i];

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-xl flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-24 h-24 rounded-3xl glass-strong grid place-items-center text-4xl text-gold-400 mb-8">
          {s.icon}
        </div>
        <div className="text-[11px] tracking-[0.3em] text-white/40 uppercase mb-2">
          {i + 1} / {SLIDES.length}
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3 text-center">{s.title}</h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-xs text-center">{s.body}</p>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-gold-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {i > 0 && (
            <button className="btn-ghost flex-1" onClick={() => setI(i - 1)}>
              戻る
            </button>
          )}
          <button className="btn-ghost flex-1" onClick={onDone}>
            スキップ
          </button>
          <button
            className="btn-primary flex-[2]"
            onClick={() => (last ? onDone() : setI(i + 1))}
          >
            {last ? "はじめる" : "次へ"}
          </button>
        </div>
      </div>
    </div>
  );
}

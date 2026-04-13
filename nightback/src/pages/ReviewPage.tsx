import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import { nowHhmm } from "../lib/time";

export default function ReviewPage() {
  const nav = useNavigate();
  const save = useAppStore((s) => s.saveReview);
  const [feeling, setFeeling] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState("");
  const [actual, setActual] = useState(nowHhmm());

  const onSave = () => {
    save({ feeling, note, actualBedtime: actual });
    nav("/home", { replace: true });
  };

  return (
    <div className="page-shell">
      <PageHeader title="ふりかえり" subtitle="今夜どうだった？" back />

      <div className="section-card mb-4">
        <label className="label-base">気分</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setFeeling(n as 1 | 2 | 3 | 4 | 5)}
              className={`flex-1 py-3 rounded-xl text-lg border transition ${
                feeling === n
                  ? "border-accent/70 bg-accent/10 text-accent"
                  : "border-ink-500/60 bg-ink-700 text-slate-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="muted-text mt-2">1=崩れた 5=完璧</p>
      </div>

      <div className="section-card mb-4">
        <label className="label-base">実際に寝た時刻</label>
        <input type="time" value={actual} onChange={(e) => setActual(e.target.value)} className="input-base" />
      </div>

      <div className="section-card mb-4">
        <label className="label-base">メモ（任意）</label>
        <textarea
          className="input-base min-h-[96px]"
          placeholder="うまくいった点・崩れた点"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button onClick={onSave} className="primary-button">
        保存して終える
      </button>
    </div>
  );
}

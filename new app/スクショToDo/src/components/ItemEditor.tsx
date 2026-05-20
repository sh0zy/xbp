import { useRef, useState } from "react";
import type { LaterItem, Priority } from "../types";
import { fileToCompressedDataUrl } from "../utils/image";

type Props = {
  initial?: Partial<LaterItem>;
  onCancel: () => void;
  onSave: (data: Omit<LaterItem, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: () => void;
};

export function ItemEditor({ initial, onCancel, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSave = title.trim().length > 0 || !!image;

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const data = await fileToCompressedDataUrl(file, 1200, 0.82);
      setImage(data);
    } catch (err) {
      console.error(err);
      alert("画像の読み込みに失敗しました");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-0 overflow-hidden">
        {image ? (
          <div className="relative">
            <img
              src={image}
              alt=""
              className="w-full max-h-[360px] object-contain bg-black/40"
            />
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-xs text-white/90 border border-white/10"
              >
                変更
              </button>
              <button
                onClick={() => setImage(undefined)}
                className="rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-xs text-rose-200 border border-white/10"
              >
                削除
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="w-full aspect-[4/3] grid place-items-center text-white/40 hover:text-white/70 hover:bg-white/[0.02] transition"
          >
            <div className="text-center px-6">
              <div className="text-4xl mb-2">▤</div>
              <div className="text-sm text-white/70">スクショを添付</div>
              <div className="text-[11px] text-white/40 mt-1">
                端末の画像から選択（権限不要）
              </div>
            </div>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
      </div>

      <div className="card">
        <label className="text-xs text-white/50 mb-1 block">このスクショで何をする？</label>
        <input
          className="input"
          placeholder="例: ESの締切を確認する"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="card">
        <label className="text-xs text-white/50 mb-1 block">メモ</label>
        <textarea
          className="input min-h-[80px] resize-none"
          placeholder="背景・詳細・情報源など"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <label className="text-xs text-white/50 mb-2 block">優先度</label>
          <div className="flex gap-1.5">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`chip flex-1 justify-center ${priority === p ? "chip-active" : ""}`}
              >
                {p === "low" ? "低" : p === "medium" ? "中" : "高"}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <label className="text-xs text-white/50 mb-2 block">期限</label>
          <input
            type="date"
            className="input py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <label className="text-xs text-white/50 mb-2 block">時刻（通知）</label>
        <div className="flex gap-2 items-center">
          <input
            type="time"
            className="input py-2 flex-1"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            disabled={!dueDate}
          />
          {dueTime && (
            <button
              onClick={() => setDueTime("")}
              className="chip text-white/60"
            >
              クリア
            </button>
          )}
        </div>
        <div className="text-[11px] text-white/40 mt-2">
          期限日を設定すると時刻指定ができます。当日に通知が届きます。
        </div>
      </div>

      <div className="card">
        <label className="text-xs text-white/50 mb-1 block">URL</label>
        <input
          className="input"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputMode="url"
        />
      </div>

      <div className="card">
        <label className="text-xs text-white/50 mb-1 block">追加メモ</label>
        <textarea
          className="input min-h-[60px] resize-none"
          placeholder="補足"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className="h-2" />
      <div className="flex gap-2">
        {onDelete && (
          <button className="btn-ghost flex-1 text-rose-300" onClick={onDelete}>
            削除
          </button>
        )}
        <button className="btn-ghost flex-1" onClick={onCancel}>
          キャンセル
        </button>
        <button
          disabled={!canSave || busy}
          className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() =>
            onSave({
              title: title.trim() || "無題のスクショ",
              content: content.trim(),
              image,
              priority,
              dueDate: dueDate || undefined,
              dueTime: dueDate && dueTime ? dueTime : undefined,
              memo: memo.trim() || undefined,
              url: url.trim() || undefined,
              actionStatus: initial?.actionStatus ?? "unprocessed",
              processedAt: initial?.processedAt,
            })
          }
        >
          {busy ? "処理中..." : "保存"}
        </button>
      </div>
    </div>
  );
}

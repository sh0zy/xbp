import { useState } from "react";

export function QuickAdd({
  onAdd,
  placeholder = "今日のToDoをサクッと追加",
}: {
  onAdd: (title: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    onAdd(t);
    setValue("");
  };

  return (
    <div className="card p-2 flex items-center gap-2">
      <span className="ml-2 text-accent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-[15px] py-2.5 placeholder:text-ink-dim"
      />
      <button onClick={submit} className="btn-primary btn-sm" aria-label="追加">
        追加
      </button>
    </div>
  );
}

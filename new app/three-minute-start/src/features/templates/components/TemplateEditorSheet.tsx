import { useEffect, useState } from "react";
import { PrimaryButton } from "../../../components/common/PrimaryButton";
import { COLOR_BG, classNames } from "../../../lib/utils";
import type { ColorKey, TaskTemplate } from "../../../types/app";

interface TemplateEditorSheetProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    input: Omit<TaskTemplate, "id" | "sortOrder" | "isDefault">,
  ) => void;
}

const ICON_CHOICES = [
  "📝",
  "📚",
  "🎓",
  "💬",
  "🧺",
  "🧹",
  "📖",
  "✍️",
  "🗂️",
  "💻",
  "🎨",
  "🏃",
  "🍳",
  "🛒",
  "💡",
  "🔧",
];

const COLOR_CHOICES: ColorKey[] = [
  "blue",
  "violet",
  "pink",
  "teal",
  "amber",
  "lime",
  "rose",
  "slate",
];

export function TemplateEditorSheet({
  open,
  onClose,
  onCreate,
}: TemplateEditorSheetProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(ICON_CHOICES[0]);
  const [colorKey, setColorKey] = useState<ColorKey>("blue");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [step4, setStep4] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setIcon(ICON_CHOICES[0]);
      setColorKey("blue");
      setStep1("");
      setStep2("");
      setStep3("");
      setStep4("");
    }
  }, [open]);

  if (!open) return null;

  const trimmedSteps = [step1, step2, step3, step4]
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const canSave = title.trim().length > 0 && trimmedSteps.length > 0;

  function handleSave() {
    if (!canSave) return;
    onCreate({
      title: title.trim(),
      icon,
      firstStepOptions: trimmedSteps,
      colorKey,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="safe-pb max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft dark:bg-ink-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-800 dark:text-ink-100">
            テンプレを追加
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <label className="text-xs font-medium text-ink-500 dark:text-ink-400">
          タイトル
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 英単語、ストレッチ、家計簿..."
          className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-base outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-brand-500 dark:focus:ring-brand-700/40"
        />

        <div className="mt-4">
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            アイコン
          </p>
          <div className="mt-2 grid grid-cols-8 gap-2">
            {ICON_CHOICES.map((emo) => {
              const active = icon === emo;
              return (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setIcon(emo)}
                  className={classNames(
                    "grid h-9 w-9 place-items-center rounded-xl text-xl",
                    active
                      ? "bg-brand-500 text-white shadow-soft"
                      : "bg-ink-100 dark:bg-ink-700",
                  )}
                >
                  {emo}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            カラー
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLOR_CHOICES.map((c) => {
              const active = colorKey === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorKey(c)}
                  className={classNames(
                    "h-8 rounded-full px-3 text-xs font-medium",
                    COLOR_BG[c],
                    active ? "ring-2 ring-brand-500 ring-offset-1" : "",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            最初の1歩の候補（最低1つ）
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              value={step1}
              onChange={(e) => setStep1(e.target.value)}
              placeholder="例: ファイルを開くだけ"
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
            <input
              type="text"
              value={step2}
              onChange={(e) => setStep2(e.target.value)}
              placeholder="例: 1行だけ書く（任意）"
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
            <input
              type="text"
              value={step3}
              onChange={(e) => setStep3(e.target.value)}
              placeholder="例: 1分だけ眺める（任意）"
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
            <input
              type="text"
              value={step4}
              onChange={(e) => setStep4(e.target.value)}
              placeholder="例: 道具を出すだけ（任意）"
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <PrimaryButton
            fullWidth
            size="lg"
            onClick={handleSave}
            disabled={!canSave}
          >
            追加する
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            size="md"
            variant="ghost"
            onClick={onClose}
          >
            キャンセル
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

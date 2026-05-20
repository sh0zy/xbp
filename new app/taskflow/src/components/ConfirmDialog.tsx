type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "実行する",
  cancelLabel = "キャンセル",
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm m-3 card p-5 animate-[fadeIn_.15s_ease-out]">
        <h3 className="text-[16px] font-semibold text-ink-base mb-1">{title}</h3>
        {description && <p className="text-[13px] text-ink-mute leading-relaxed mb-4">{description}</p>}
        <div className="flex gap-2">
          <button className="btn-ghost flex-1" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={destructive ? "btn-danger flex-1" : "btn-primary flex-1"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

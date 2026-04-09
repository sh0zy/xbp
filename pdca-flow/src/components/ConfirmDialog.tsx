interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = '確認', danger }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-surface rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-surface-light rounded-xl py-3 text-text-secondary font-medium">
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 font-medium text-white ${danger ? 'bg-danger' : 'bg-primary'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

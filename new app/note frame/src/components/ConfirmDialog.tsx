import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'キャンセル',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/72 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-[398px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,32,0.98),rgba(10,12,19,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-amber-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm leading-6 text-white/64">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/6 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-12 flex-1 rounded-2xl px-4 text-sm font-semibold transition ${
              destructive
                ? 'bg-rose-500 text-white shadow-[0_18px_38px_rgba(244,63,94,0.28)] hover:bg-rose-400'
                : 'bg-white text-slate-950 shadow-[0_18px_38px_rgba(255,255,255,0.16)] hover:bg-white/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

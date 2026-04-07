import { Inbox, Camera } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <Inbox size={28} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Camera size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ message, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-30">📋</div>
      <p className="text-text-muted mb-4">{message}</p>
      {action && onAction && (
        <button onClick={onAction} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium">
          {action}
        </button>
      )}
    </div>
  );
}

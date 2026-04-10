import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  message: string;
  sub?: string;
}

export function EmptyState({ icon: Icon, message, sub }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={40} className="text-dark-400 mb-3" />
      <p className="text-dark-200 font-medium">{message}</p>
      {sub && <p className="text-dark-300 text-sm mt-1">{sub}</p>}
    </div>
  );
}

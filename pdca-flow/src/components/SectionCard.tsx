import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-surface rounded-2xl p-4 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-text-secondary mb-3">{title}</h3>}
      {children}
    </div>
  );
}

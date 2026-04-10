import clsx from 'clsx';

interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className }: Props) {
  return (
    <section className={clsx('glass-card rounded-2xl p-4', className)}>
      {title && <h2 className="text-sm font-semibold text-dark-200 mb-3">{title}</h2>}
      {children}
    </section>
  );
}

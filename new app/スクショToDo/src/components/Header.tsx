type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function Header({ title, subtitle, right }: Props) {
  return (
    <header className="safe-top px-5 pt-2 pb-4 flex items-end justify-between gap-3">
      <div>
        {subtitle && (
          <div className="text-xs uppercase tracking-[0.2em] text-white/40">{subtitle}</div>
        )}
        <h1 className="text-2xl font-semibold text-white/95 mt-1">{title}</h1>
      </div>
      {right}
    </header>
  );
}

import { cn } from '@/lib/cn';

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('grid rounded-[22px] border border-white/10 bg-white/6 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'min-h-11 rounded-[18px] px-3 text-sm font-medium transition-all',
            option.value === value ? 'bg-white text-slate-950 shadow-[0_10px_26px_rgba(255,255,255,0.14)]' : 'text-white/62',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

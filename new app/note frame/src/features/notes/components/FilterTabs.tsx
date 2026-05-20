import type { NoteFilter } from '@/features/notes/types/note';
import { cn } from '@/lib/cn';

interface FilterTabsProps {
  value: NoteFilter;
  options: readonly {
    value: NoteFilter;
    label: string;
  }[];
  onChange: (value: NoteFilter) => void;
}

export function FilterTabs({ value, options, onChange }: FilterTabsProps) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition',
            option.value === value
              ? 'border-white/12 bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)]'
              : 'border-white/10 bg-white/6 text-white/66 hover:bg-white/10',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

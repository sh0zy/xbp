import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onFilterToggle: () => void;
  activeCount?: number;
}

export function SearchBar({ value, onChange, onFilterToggle, activeCount = 0 }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          placeholder="授業名・教員名で検索..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-dark-400 focus:outline-none focus:border-accent-blue"
        />
      </div>
      <button
        onClick={onFilterToggle}
        className="relative p-2.5 rounded-xl bg-dark-700 border border-dark-600 text-dark-300 active:text-white active:border-accent-blue"
      >
        <SlidersHorizontal size={18} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-accent-blue text-white text-[10px] font-bold flex items-center justify-center px-1">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}

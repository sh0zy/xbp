import { X } from 'lucide-react';
import { DAY_LABELS, FACULTIES, CAMPUSES, CATEGORIES, GRADES, CATEGORY_GROUP_LABELS } from '@/types';
import type { CategoryGroup } from '@/types';

export interface SearchFilters {
  dayOfWeek: number[];
  period: number[];
  faculty: string[];
  campus: string[];
  category: string[];
  categoryGroup: CategoryGroup[];
  credits: number[];
  grades: number[];
  evalType: '' | 'exam' | 'report' | 'attendance' | 'noExam';
  /** 楽単度 0-100 の下限。0 は未設定 */
  minEasyScore: number;
}

export const defaultFilters: SearchFilters = {
  dayOfWeek: [],
  period: [],
  faculty: [],
  campus: [],
  category: [],
  categoryGroup: [],
  credits: [],
  grades: [],
  evalType: '',
  minEasyScore: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-accent-blue text-white'
          : 'bg-dark-600 text-dark-300 active:bg-dark-500'
      }`}
    >
      {children}
    </button>
  );
}

function ChipGroup({ label, children, activeCount, onClear }: { label: string; children: React.ReactNode; activeCount: number; onClear: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-dark-300 font-medium">
          {label}
          {activeCount > 0 && <span className="ml-1.5 text-accent-blue">({activeCount})</span>}
        </label>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-[10px] text-dark-400 active:text-dark-200 underline">
            クリア
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function SearchFilterSheet({ open, onClose, filters, onChange }: Props) {
  if (!open) return null;

  const totalActive =
    filters.dayOfWeek.length + filters.period.length + filters.faculty.length +
    filters.campus.length + filters.category.length + filters.categoryGroup.length +
    filters.credits.length + filters.grades.length +
    (filters.evalType ? 1 : 0) + (filters.minEasyScore > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl p-4 pb-8 space-y-4 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-dark-800 pb-2 -mx-4 px-4 z-10">
          <h3 className="font-bold">
            絞り込み
            {totalActive > 0 && <span className="ml-2 text-xs text-accent-blue">{totalActive}件適用中</span>}
          </h3>
          <button onClick={onClose} className="text-dark-300 active:text-white"><X size={20} /></button>
        </div>

        <ChipGroup
          label="科目区分"
          activeCount={filters.categoryGroup.length}
          onClear={() => onChange({ ...filters, categoryGroup: [] })}
        >
          {(Object.keys(CATEGORY_GROUP_LABELS) as CategoryGroup[]).map((g) => (
            <Chip
              key={g}
              active={filters.categoryGroup.includes(g)}
              onClick={() => onChange({ ...filters, categoryGroup: toggle(filters.categoryGroup, g) })}
            >
              {CATEGORY_GROUP_LABELS[g]}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="取れる学年"
          activeCount={filters.grades.length}
          onClear={() => onChange({ ...filters, grades: [] })}
        >
          {GRADES.map((g) => (
            <Chip
              key={g}
              active={filters.grades.includes(g)}
              onClick={() => onChange({ ...filters, grades: toggle(filters.grades, g) })}
            >
              {g}年
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="キャンパス"
          activeCount={filters.campus.length}
          onClear={() => onChange({ ...filters, campus: [] })}
        >
          {CAMPUSES.map((c) => (
            <Chip
              key={c}
              active={filters.campus.includes(c)}
              onClick={() => onChange({ ...filters, campus: toggle(filters.campus, c) })}
            >
              {c}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="学部"
          activeCount={filters.faculty.length}
          onClear={() => onChange({ ...filters, faculty: [] })}
        >
          {FACULTIES.map((f) => (
            <Chip
              key={f}
              active={filters.faculty.includes(f)}
              onClick={() => onChange({ ...filters, faculty: toggle(filters.faculty, f) })}
            >
              {f}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="詳細カテゴリ"
          activeCount={filters.category.length}
          onClear={() => onChange({ ...filters, category: [] })}
        >
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={filters.category.includes(c)}
              onClick={() => onChange({ ...filters, category: toggle(filters.category, c) })}
            >
              {c}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="曜日"
          activeCount={filters.dayOfWeek.length}
          onClear={() => onChange({ ...filters, dayOfWeek: [] })}
        >
          {DAY_LABELS.map((d, i) => (
            <Chip
              key={i}
              active={filters.dayOfWeek.includes(i)}
              onClick={() => onChange({ ...filters, dayOfWeek: toggle(filters.dayOfWeek, i) })}
            >
              {d}曜
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="時限"
          activeCount={filters.period.length}
          onClear={() => onChange({ ...filters, period: [] })}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <Chip
              key={p}
              active={filters.period.includes(p)}
              onClick={() => onChange({ ...filters, period: toggle(filters.period, p) })}
            >
              {p}限
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="単位数"
          activeCount={filters.credits.length}
          onClear={() => onChange({ ...filters, credits: [] })}
        >
          {[1, 2, 3, 4].map((c) => (
            <Chip
              key={c}
              active={filters.credits.includes(c)}
              onClick={() => onChange({ ...filters, credits: toggle(filters.credits, c) })}
            >
              {c}単位
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="評価方法"
          activeCount={filters.evalType ? 1 : 0}
          onClear={() => onChange({ ...filters, evalType: '' })}
        >
          {([
            { value: 'noExam', label: 'テストなし' },
            { value: 'exam', label: 'テスト重視(50%以上)' },
            { value: 'report', label: 'レポート重視(40%以上)' },
            { value: 'attendance', label: '出席重視(30%以上)' },
          ] as const).map((opt) => (
            <Chip
              key={opt.value}
              active={filters.evalType === opt.value}
              onClick={() => onChange({ ...filters, evalType: filters.evalType === opt.value ? '' : opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </ChipGroup>

        <ChipGroup
          label="履修しやすさ (楽単度)"
          activeCount={filters.minEasyScore > 0 ? 1 : 0}
          onClear={() => onChange({ ...filters, minEasyScore: 0 })}
        >
          {[
            { v: 0, label: 'すべて' },
            { v: 60, label: '標準以上' },
            { v: 75, label: '高め' },
            { v: 85, label: 'かなり高い' },
          ].map((opt) => (
            <Chip
              key={opt.v}
              active={filters.minEasyScore === opt.v}
              onClick={() => onChange({ ...filters, minEasyScore: opt.v })}
            >
              {opt.label}
            </Chip>
          ))}
        </ChipGroup>

        <div className="flex gap-2 pt-2">
          <button onClick={() => onChange(defaultFilters)} className="flex-1 py-2.5 rounded-xl bg-dark-600 text-dark-200 text-sm font-medium active:bg-dark-500">
            すべてリセット
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium active:bg-accent-blue/80">
            適用
          </button>
        </div>
      </div>
    </div>
  );
}

import { X } from 'lucide-react';
import { DAY_LABELS, FACULTIES, CAMPUSES, CATEGORIES } from '@/types';

export interface SearchFilters {
  dayOfWeek: number | null;
  period: number | null;
  faculty: string;
  campus: string;
  category: string;
  credits: number | null;
  evalType: '' | 'exam' | 'report' | 'attendance' | 'noExam';
}

export const defaultFilters: SearchFilters = {
  dayOfWeek: null, period: null, faculty: '', campus: '', category: '', credits: null, evalType: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-xs text-dark-300 mb-1 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent-blue text-dark-50">
        <option value="">すべて</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function SearchFilterSheet({ open, onClose, filters, onChange }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl p-4 pb-8 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">絞り込み</h3>
          <button onClick={onClose} className="text-dark-300"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="曜日"
            value={filters.dayOfWeek !== null ? String(filters.dayOfWeek) : ''}
            onChange={(v) => onChange({ ...filters, dayOfWeek: v ? Number(v) : null })}
            options={DAY_LABELS.map((d, i) => ({ value: String(i), label: `${d}曜` }))}
          />
          <Select
            label="時限"
            value={filters.period !== null ? String(filters.period) : ''}
            onChange={(v) => onChange({ ...filters, period: v ? Number(v) : null })}
            options={[1,2,3,4,5,6,7].map((p) => ({ value: String(p), label: `${p}限` }))}
          />
          <Select
            label="学部"
            value={filters.faculty}
            onChange={(v) => onChange({ ...filters, faculty: v })}
            options={FACULTIES.map((f) => ({ value: f, label: f }))}
          />
          <Select
            label="キャンパス"
            value={filters.campus}
            onChange={(v) => onChange({ ...filters, campus: v })}
            options={CAMPUSES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="区分"
            value={filters.category}
            onChange={(v) => onChange({ ...filters, category: v })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="単位数"
            value={filters.credits !== null ? String(filters.credits) : ''}
            onChange={(v) => onChange({ ...filters, credits: v ? Number(v) : null })}
            options={[1,2,3,4].map((c) => ({ value: String(c), label: `${c}単位` }))}
          />
        </div>

        {/* 評価方法フィルター */}
        <div>
          <label className="text-xs text-dark-300 mb-2 block">評価方法で絞り込み</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: '', label: 'すべて' },
              { value: 'noExam', label: 'テストなし' },
              { value: 'exam', label: 'テスト重視（50%以上）' },
              { value: 'report', label: 'レポート重視（40%以上）' },
              { value: 'attendance', label: '出席重視（30%以上）' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, evalType: opt.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.evalType === opt.value
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark-600 text-dark-300 active:bg-dark-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onChange(defaultFilters)} className="flex-1 py-2.5 rounded-xl bg-dark-600 text-dark-200 text-sm font-medium active:bg-dark-500">
            リセット
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium active:bg-accent-blue/80">
            適用
          </button>
        </div>
      </div>
    </div>
  );
}

import { X, Trash2 } from 'lucide-react';
import type { Course } from '@/types';
import { COURSE_COLORS, DAY_LABELS } from '@/types';
import { useTimetableStore } from '@/store/timetableStore';

interface Props {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

export function CellOptionsSheet({ open, onClose, course }: Props) {
  const { entries, updateColor, removeEntry } = useTimetableStore();
  if (!open || !course) return null;

  const entry = entries.find((e) => e.courseId === course.id);
  const currentColor = entry?.customColor ?? COURSE_COLORS[0];

  const handleRemove = () => {
    if (confirm(`「${course.title}」を時間割から外しますか？`)) {
      removeEntry(course.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl p-4 pb-8 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold truncate pr-2">{course.title}</h3>
          <button onClick={onClose} className="text-dark-300 active:text-white"><X size={20} /></button>
        </div>
        <p className="text-xs text-dark-400">
          {DAY_LABELS[course.dayOfWeek]}曜 {course.period}限 · {course.instructor}
        </p>

        <div>
          <p className="text-xs text-dark-300 font-medium mb-2">色を変更</p>
          <div className="grid grid-cols-6 gap-2">
            {COURSE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { updateColor(course.id, c); }}
                className={`aspect-square rounded-lg transition-transform active:scale-95 ${c === currentColor ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`色 ${c}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-red/20 text-accent-red text-sm font-medium active:bg-accent-red/30"
        >
          <Trash2 size={16} /> 時間割から外す
        </button>
      </div>
    </div>
  );
}

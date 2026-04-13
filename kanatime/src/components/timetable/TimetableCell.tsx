import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Course } from '@/types';

interface Props {
  course?: Course;
  color: string;
  editMode: boolean;
  onEmptyClick: () => void;
  onEdit: () => void;
}

export function TimetableCell({ course, color, editMode, onEmptyClick, onEdit }: Props) {
  const navigate = useNavigate();

  if (!course) {
    return (
      <button
        onClick={onEmptyClick}
        className="h-16 rounded-lg bg-dark-800/50 border border-dashed border-dark-600/50 flex items-center justify-center text-dark-500 active:bg-dark-700/50 active:text-dark-300 transition-colors"
        aria-label="空きコマに授業を追加"
      >
        <Plus size={14} />
      </button>
    );
  }

  const handleClick = () => {
    if (editMode) {
      onEdit();
    } else {
      navigate(`/search/${course.id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`h-16 rounded-lg p-1 text-left transition-transform active:scale-95 overflow-hidden ${editMode ? 'ring-1 ring-accent-blue/60' : ''}`}
      style={{ backgroundColor: color + '30', borderLeft: `3px solid ${color}` }}
    >
      <p className="text-[10px] font-semibold leading-tight truncate" style={{ color }}>
        {course.title}
      </p>
      <p className="text-[8px] text-dark-300 mt-0.5 truncate">{course.room}</p>
    </button>
  );
}

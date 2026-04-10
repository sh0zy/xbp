import { useNavigate } from 'react-router-dom';
import type { Course } from '@/types';

interface Props {
  course?: Course;
  color: string;
}

export function TimetableCell({ course, color }: Props) {
  const navigate = useNavigate();

  if (!course) {
    return <div className="h-16 rounded-lg bg-dark-800/50 border border-dark-700/30" />;
  }

  return (
    <button
      onClick={() => navigate(`/search/${course.id}`)}
      className="h-16 rounded-lg p-1 text-left transition-transform active:scale-95 overflow-hidden"
      style={{ backgroundColor: color + '30', borderLeft: `3px solid ${color}` }}
    >
      <p className="text-[10px] font-semibold leading-tight truncate" style={{ color }}>
        {course.title}
      </p>
      <p className="text-[8px] text-dark-300 mt-0.5 truncate">{course.room}</p>
    </button>
  );
}

import { Plus, Minus, ClipboardList, UserCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTimetableStore } from '@/store/timetableStore';
import { COURSE_COLORS } from '@/types';

interface Props {
  courseId: string;
  syllabusUrl?: string;
}

export function CourseActions({ courseId, syllabusUrl }: Props) {
  const navigate = useNavigate();
  const { isInTimetable, addEntry, removeEntry, entries } = useTimetableStore();
  const inTable = isInTimetable(courseId);

  const actions = [
    {
      label: inTable ? '時間割から削除' : '時間割に追加',
      icon: inTable ? Minus : Plus,
      color: inTable ? 'text-accent-red' : 'text-accent-green',
      bg: inTable ? 'bg-accent-red/10' : 'bg-accent-green/10',
      action: () => inTable ? removeEntry(courseId) : addEntry(courseId, COURSE_COLORS[entries.length % COURSE_COLORS.length]),
    },
    {
      label: '課題追加',
      icon: ClipboardList,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      action: () => navigate('/tasks'),
    },
    {
      label: '出欠記録',
      icon: UserCheck,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
      action: () => navigate(`/attendance/${courseId}`),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.action}
          className={`flex items-center gap-2 p-3 rounded-xl ${a.bg} active:opacity-80`}
        >
          <a.icon size={18} className={a.color} />
          <span className="text-xs font-medium">{a.label}</span>
        </button>
      ))}
      {syllabusUrl && (
        <a
          href={syllabusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-xl bg-accent-orange/10 active:opacity-80"
        >
          <ExternalLink size={18} className="text-accent-orange" />
          <span className="text-xs font-medium">公式情報</span>
        </a>
      )}
    </div>
  );
}

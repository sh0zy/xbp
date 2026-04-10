import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '@/components/common/SectionCard';
import type { Course } from '@/types';

interface AlertItem {
  course: Course;
  rate: number;
}

interface Props {
  alerts: AlertItem[];
}

export function AttendanceAlertCard({ alerts }: Props) {
  const navigate = useNavigate();
  if (alerts.length === 0) return null;

  return (
    <SectionCard title="出席注意">
      <div className="space-y-2">
        {alerts.map(({ course, rate }) => (
          <button
            key={course.id}
            onClick={() => navigate(`/attendance/${course.id}`)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-left active:bg-accent-red/20"
          >
            <AlertTriangle size={18} className="text-accent-red shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{course.title}</p>
              <p className="text-xs text-accent-red/80">出席率 {rate}%</p>
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

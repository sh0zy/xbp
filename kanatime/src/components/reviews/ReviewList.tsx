import { Flag } from 'lucide-react';
import type { CourseReview } from '@/types';
import { useReviewStore } from '@/store/reviewStore';

interface Props {
  reviews: CourseReview[];
}

export function ReviewList({ reviews }: Props) {
  const { report } = useReviewStore();

  if (reviews.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-dark-300">レビューは個人の主観を含む参考情報です</p>
      {reviews.map((r) => (
        <div key={r.id} className="p-3 rounded-xl bg-dark-700/50">
          <p className="text-sm">{r.shortComment}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-dark-400">{r.createdAt}</span>
            <button
              onClick={() => report(r.id)}
              className="flex items-center gap-1 text-xs text-dark-400 active:text-accent-red"
            >
              <Flag size={12} />
              <span>通報</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

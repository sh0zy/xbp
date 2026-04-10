import { Badge } from '@/components/common/Badge';

interface Props {
  averages: Record<string, number> | null;
  reviewCount: number;
}

const labels: Record<string, string> = {
  workload: '課題量',
  exam: 'テスト負荷',
  attendance: '出席の厳しさ',
  clarity: '分かりやすさ',
  ease: '履修しやすさ',
  satisfaction: '総合満足度',
};

export function ReviewScoreBars({ averages, reviewCount }: Props) {
  if (!averages) {
    return (
      <div className="text-center py-6 text-dark-400 text-sm">
        まだレビューがありません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-dark-300">{reviewCount}件のレビュー</span>
        {reviewCount < 3 && <Badge variant="orange">参考情報</Badge>}
      </div>
      {Object.entries(labels).map(([key, label]) => {
        const val = averages[key] ?? 0;
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-dark-300 w-28 shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-blue transition-all"
                style={{ width: `${(val / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8 text-right">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

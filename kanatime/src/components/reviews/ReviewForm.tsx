import { useState } from 'react';
import { useReviewStore } from '@/store/reviewStore';

interface Props {
  courseId: string;
  onDone: () => void;
}

const scoreLabels = [
  { key: 'workload', label: '課題量' },
  { key: 'exam', label: 'テスト負荷' },
  { key: 'attendance', label: '出席の厳しさ' },
  { key: 'clarity', label: '分かりやすさ' },
  { key: 'ease', label: '履修しやすさ' },
  { key: 'satisfaction', label: '総合満足度' },
] as const;

export function ReviewForm({ courseId, onDone }: Props) {
  const { add } = useReviewStore();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const allFilled = scoreLabels.every((s) => scores[s.key] && scores[s.key] > 0);
  const canSubmit = allFilled && agree;

  const handleSubmit = () => {
    const result = add({
      courseId,
      workloadScore: scores.workload,
      examScore: scores.exam,
      attendanceStrictnessScore: scores.attendance,
      clarityScore: scores.clarity,
      easeScore: scores.ease,
      satisfactionScore: scores.satisfaction,
      shortComment: comment,
    });
    if (result === 'NG_WORD') {
      setError('不適切な表現が含まれています。内容を修正してください。');
      return;
    }
    onDone();
  };

  return (
    <div className="space-y-4">
      {scoreLabels.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs text-dark-300 mb-1 block">{label}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setScores((s) => ({ ...s, [key]: n }))}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  scores[key] === n
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark-600 text-dark-300 active:bg-dark-500'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="text-xs text-dark-300 mb-1 block">コメント（任意・120文字以内）</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 120))}
          rows={3}
          className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-accent-blue placeholder:text-dark-400"
          placeholder="授業の感想を短く..."
        />
        <p className="text-xs text-dark-400 text-right">{comment.length}/120</p>
      </div>

      {error && <p className="text-xs text-accent-red">{error}</p>}

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 accent-accent-blue"
        />
        <span className="text-xs text-dark-300">
          個人攻撃や不適切投稿をしません
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-accent-blue text-white active:bg-accent-blue/80"
      >
        レビューを投稿
      </button>
    </div>
  );
}

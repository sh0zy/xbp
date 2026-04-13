import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { useCommunityStore } from '@/store/communityStore';
import type { Circle } from '@/types/community';

const GENRES: Circle['genre'][] = ['スポーツ', '音楽', '学術', '文化', '国際', 'ボランティア', 'その他'];

export function CirclesPage() {
  const { circles, load } = useCommunityStore();
  const [genre, setGenre] = useState<Circle['genre'] | ''>('');
  const [campus, setCampus] = useState('');

  useEffect(() => { load(); }, []);

  const filtered = circles.filter((c) => {
    if (genre && c.genre !== genre) return false;
    if (campus && c.campus !== campus) return false;
    return true;
  });

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="サークル紹介" back />
      <p className="text-xs text-dark-400">新入生歓迎! 気になるサークルをチェック</p>

      {/* ジャンルチップ */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => setGenre('')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${genre === '' ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
        >
          すべて
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(genre === g ? '' : g)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${genre === g ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {['', '横浜', 'みなとみらい'].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCampus(c)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium ${campus === c ? 'bg-dark-500 text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
          >
            {c || '全キャンパス'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Sparkles} message="該当するサークルがありません" />
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-dark-700/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="purple">{c.genre}</Badge>
                    <Badge>{c.campus}</Badge>
                  </div>
                </div>
                {c.welcomingFreshmen && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green text-[10px] font-medium">
                    新歓中
                  </span>
                )}
              </div>
              <p className="text-xs text-dark-200 leading-relaxed">{c.description}</p>
              <div className="flex items-center justify-between text-[10px] text-dark-400">
                <span>活動日: {c.activityDays.join('・')}</span>
                <span>メンバー {c.memberCount}人</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-dark-400 text-center pb-2">
        ※モックデータです。公式情報は各サークル・大学のページで確認してください
      </p>
    </div>
  );
}

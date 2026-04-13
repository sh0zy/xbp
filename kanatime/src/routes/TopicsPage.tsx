import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { useCommunityStore } from '@/store/communityStore';

const CATEGORIES = ['すべて', '履修', 'キャンパス', '新歓'] as const;

export function TopicsPage() {
  const { topics, load } = useCommunityStore();
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('すべて');

  useEffect(() => { load(); }, []);

  const filtered = category === 'すべて' ? topics : topics.filter((t) => t.category === category);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="話題" back />
      <p className="text-xs text-dark-400">新入生の話題・質問・情報交換</p>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${category === c ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MessageCircle} message="話題がありません" />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-dark-700/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Badge variant="blue">{t.category}</Badge>
                  <p className="font-medium text-sm mt-1.5">{t.title}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end text-[10px] text-dark-400">
                  <MessageCircle size={12} />
                  <span>{t.replies}</span>
                </div>
              </div>
              <p className="text-xs text-dark-300 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-dark-400 text-center pb-2">
        ※モックデータ表示です。投稿機能は将来実装予定
      </p>
    </div>
  );
}

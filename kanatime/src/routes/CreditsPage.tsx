import { useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatPill } from '@/components/common/StatPill';
import { useCreditStore } from '@/store/creditStore';

export function CreditsPage() {
  const { credits, load, update } = useCreditStore();

  useEffect(() => { load(); }, []);

  const total = credits.completedCredits + credits.inProgressCredits;
  const progress = credits.targetCredits > 0 ? Math.round((total / credits.targetCredits) * 100) : 0;

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="単位管理" back />

      <div className="flex gap-2 justify-center flex-wrap">
        <StatPill label="目標" value={credits.targetCredits} />
        <StatPill label="取得済み" value={credits.completedCredits} color="text-accent-green" />
        <StatPill label="履修中" value={credits.inProgressCredits} color="text-accent-blue" />
        <StatPill label="予定" value={credits.plannedCredits} color="text-accent-purple" />
      </div>

      <SectionCard title="進捗">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-300">達成率</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="単位数を編集">
        {([
          { key: 'targetCredits' as const, label: '目標単位数' },
          { key: 'completedCredits' as const, label: '取得済み' },
          { key: 'inProgressCredits' as const, label: '履修中' },
          { key: 'plannedCredits' as const, label: '予定' },
        ]).map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm text-dark-300">{label}</span>
            <input
              type="number"
              value={credits[key]}
              onChange={(e) => update({ [key]: Number(e.target.value) || 0 })}
              className="w-20 bg-dark-600 border border-dark-500 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-accent-blue text-dark-50"
            />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

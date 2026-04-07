import { TrendingUp, Inbox, CheckCircle2, Bell, BarChart3, Award, Zap, PieChart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calculateInsights } from '../utils/insights';
import { getCategoryLabel } from '../utils/ocr';
import type { Category } from '../types';

const categoryColors: Record<Category, string> = {
  event_ticket: 'bg-purple-500',
  order_receipt: 'bg-orange-500',
  membership_code: 'bg-green-500',
  recipe_food: 'bg-yellow-500',
  memo_note: 'bg-blue-500',
  other: 'bg-gray-400',
};

export function InsightsPage() {
  const items = useStore((s) => s.items);
  const insights = calculateInsights(items);

  const topCategories = (Object.entries(insights.categoryBreakdown) as [Category, number][])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const maxCategoryCount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <div className="pb-24">
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-gray-900">分析・振り返り</h1>
        <p className="text-sm text-gray-500 mt-1">スクショ活用の状況</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <PieChart size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">データがありません</h3>
          <p className="text-sm text-gray-400">スクショを取り込むと、ここに分析が表示されます</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          {/* Hero stat */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Award size={18} />
              <span className="text-sm font-medium text-primary-200">救出スコア</span>
            </div>
            <div className="text-4xl font-bold mb-1">{insights.rescuedCount}</div>
            <p className="text-sm text-primary-200">枚のスクショを行動化</p>
            <div className="mt-3 bg-white/10 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm">行動化率</span>
              <span className="text-lg font-bold">{insights.actionRate}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Inbox size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">未整理</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{insights.inboxCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-accent-500" />
                <span className="text-xs text-gray-500">要対応</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{insights.needsActionCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-success-500" />
                <span className="text-xs text-gray-500">完了</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{insights.completedCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} className="text-warning-500" />
                <span className="text-xs text-gray-500">リマインド</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{insights.reminderSetCount}</div>
            </div>
          </div>

          {/* Period stats */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-primary-500" />
              期間別
            </h3>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{insights.recentWeekAdded}</div>
                <div className="text-xs text-gray-500">直近7日</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{insights.recentMonthAdded}</div>
                <div className="text-xs text-gray-500">直近30日</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{insights.totalItems}</div>
                <div className="text-xs text-gray-500">合計</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <BarChart3 size={14} className="text-primary-500" />
              カテゴリ内訳
            </h3>
            <div className="space-y-3">
              {topCategories.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {getCategoryLabel(cat)}
                    </span>
                    <span className="text-xs text-gray-400">{count}枚</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${categoryColors[cat]}`}
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">完了率</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeDasharray={`${insights.completionRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{insights.completionRate}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>全{insights.totalItems - insights.archivedCount}件中</p>
                <p>{insights.completedCount}件完了</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

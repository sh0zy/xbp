import { Inbox, AlertTriangle, TrendingUp, Camera, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScreenshotCard } from '../components/ScreenshotCard';
import type { ScreenshotItem } from '../types';

interface Props {
  onSelectItem: (item: ScreenshotItem) => void;
  onImport: () => void;
}

export function HomePage({ onSelectItem, onImport }: Props) {
  const items = useStore((s) => s.items);
  const setActiveTab = useStore((s) => s.setActiveTab);

  const inboxCount = items.filter((i) => i.status === 'inbox').length;
  const needsActionCount = items.filter((i) => i.status === 'needs_action').length;
  const rescuedCount = items.filter((i) => ['saved', 'completed'].includes(i.status)).length;

  const urgentItems = items
    .filter((i) => i.status === 'needs_action' || (i.status === 'inbox' && i.extractedData.dates.length > 0))
    .slice(0, 3);

  const recentItems = items
    .filter((i) => i.status !== 'archived')
    .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())
    .slice(0, 5);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-5 pt-12 pb-8 text-white">
        <h1 className="text-xl font-bold mb-1">Screenshot Inbox</h1>
        <p className="text-primary-200 text-sm">スクショを行動に変えよう</p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('inbox')}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center"
          >
            <Inbox size={20} className="text-primary-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{inboxCount}</div>
            <div className="text-[10px] text-gray-500 font-medium">未整理</div>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center"
          >
            <AlertTriangle size={20} className="text-accent-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{needsActionCount}</div>
            <div className="text-[10px] text-gray-500 font-medium">要対応</div>
          </button>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <TrendingUp size={20} className="text-success-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{rescuedCount}</div>
            <div className="text-[10px] text-gray-500 font-medium">救出済み</div>
          </div>
        </div>
      </div>

      {/* Import CTA */}
      <div className="px-4 mt-5">
        <button
          onClick={onImport}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <Camera size={22} />
          <span className="font-semibold">スクショを取り込む</span>
        </button>
      </div>

      {/* Urgent Items */}
      {urgentItems.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-accent-500" />
            <h2 className="text-sm font-bold text-gray-800">今すぐ確認</h2>
          </div>
          <div className="space-y-2">
            {urgentItems.map((item) => (
              <ScreenshotCard key={item.id} item={item} onClick={onSelectItem} compact />
            ))}
          </div>
        </div>
      )}

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800">最近追加</h2>
            <button
              onClick={() => setActiveTab('inbox')}
              className="text-xs text-primary-600 font-medium"
            >
              すべて見る
            </button>
          </div>
          <div className="space-y-2.5">
            {recentItems.map((item) => (
              <ScreenshotCard key={item.id} item={item} onClick={onSelectItem} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            スクショを取り込もう
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            カメラロールからスクリーンショットを選択して、
            情報を整理・行動化しましょう
          </p>
        </div>
      )}
    </div>
  );
}

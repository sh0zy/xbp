import { Calendar, Tag, Clock, Star, ChevronRight } from 'lucide-react';
import type { ScreenshotItem } from '../types';
import { getCategoryLabel, getStatusLabel } from '../utils/ocr';

interface Props {
  item: ScreenshotItem;
  onClick: (item: ScreenshotItem) => void;
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  inbox: 'bg-gray-100 text-gray-600',
  needs_action: 'bg-accent-400/15 text-accent-600',
  saved: 'bg-primary-100 text-primary-700',
  completed: 'bg-success-500/15 text-success-600',
  archived: 'bg-gray-100 text-gray-500',
};

const categoryColors: Record<string, string> = {
  event_ticket: 'bg-purple-100 text-purple-700',
  order_receipt: 'bg-orange-100 text-orange-700',
  membership_code: 'bg-green-100 text-green-700',
  recipe_food: 'bg-yellow-100 text-yellow-700',
  memo_note: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-600',
};

export function ScreenshotCard({ item, onClick, compact }: Props) {
  const hasDeadline = item.extractedData.dates.length > 0;
  const hasReminder = item.reminders.some((r) => !r.completed);

  if (compact) {
    return (
      <button
        onClick={() => onClick(item)}
        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 w-full text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {item.thumbnailData && (
            <img src={item.thumbnailData} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
          <p className="text-xs text-gray-500 truncate">{getCategoryLabel(item.category)}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(item)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full text-left hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex p-3 gap-3">
        <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {item.thumbnailData && (
            <img src={item.thumbnailData} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
              {item.title}
            </h3>
            {item.isFavorite && (
              <Star size={14} className="text-warning-500 fill-warning-500 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
              {getCategoryLabel(item.category)}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
              {getStatusLabel(item.status)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
            {hasDeadline && (
              <span className="flex items-center gap-0.5">
                <Calendar size={11} />
                {item.extractedData.dates[0]}
              </span>
            )}
            {hasReminder && (
              <span className="flex items-center gap-0.5 text-accent-500">
                <Clock size={11} />
                リマインド
              </span>
            )}
            {item.tags.length > 0 && (
              <span className="flex items-center gap-0.5">
                <Tag size={11} />
                {item.tags.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

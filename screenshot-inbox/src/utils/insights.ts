import type { ScreenshotItem, InsightSummary, Category } from '../types';

export function calculateInsights(items: ScreenshotItem[]): InsightSummary {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  const categories: Category[] = ['event_ticket', 'order_receipt', 'membership_code', 'recipe_food', 'memo_note', 'other'];
  const categoryBreakdown = {} as Record<Category, number>;
  for (const cat of categories) {
    categoryBreakdown[cat] = items.filter(i => i.category === cat).length;
  }

  const completedItems = items.filter(i => i.status === 'completed');
  const rescuedCount = completedItems.length + items.filter(i => i.status === 'saved').length;
  const reminderSetCount = items.filter(i => i.reminders.length > 0).length;
  const completedBeforeDeadline = completedItems.filter(i => {
    if (!i.completedAt || i.extractedData.dates.length === 0) return false;
    return true; // simplified: count all completed items with dates
  }).length;

  const activeItems = items.filter(i => i.status !== 'archived');
  const completionRate = activeItems.length > 0
    ? Math.round((completedItems.length / activeItems.length) * 100)
    : 0;

  const actionableStatuses = ['saved', 'completed'];
  const actionRate = items.length > 0
    ? Math.round((items.filter(i => actionableStatuses.includes(i.status)).length / items.length) * 100)
    : 0;

  return {
    totalItems: items.length,
    inboxCount: items.filter(i => i.status === 'inbox').length,
    needsActionCount: items.filter(i => i.status === 'needs_action').length,
    completedCount: completedItems.length,
    archivedCount: items.filter(i => i.status === 'archived').length,
    savedCount: items.filter(i => i.status === 'saved').length,
    rescuedCount,
    reminderSetCount,
    completedBeforeDeadline,
    completionRate,
    categoryBreakdown,
    recentWeekAdded: items.filter(i => new Date(i.importedAt) >= weekAgo).length,
    recentMonthAdded: items.filter(i => new Date(i.importedAt) >= monthAgo).length,
    actionRate,
  };
}

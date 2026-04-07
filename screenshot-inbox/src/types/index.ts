export type Category =
  | 'event_ticket'
  | 'order_receipt'
  | 'membership_code'
  | 'recipe_food'
  | 'memo_note'
  | 'other';

export type ItemStatus =
  | 'inbox'
  | 'needs_action'
  | 'saved'
  | 'completed'
  | 'archived';

export type SourceType = 'camera' | 'gallery' | 'file' | 'sample';

export interface ExtractedData {
  dates: string[];
  times: string[];
  amounts: string[];
  codes: string[];
  urls: string[];
  keywords: string[];
}

export interface Reminder {
  id: string;
  date: string;
  note: string;
  completed: boolean;
}

export interface ScreenshotItem {
  id: string;
  createdAt: string;
  importedAt: string;
  imageData: string;
  thumbnailData: string;
  ocrText: string;
  category: Category;
  status: ItemStatus;
  title: string;
  note: string;
  extractedData: ExtractedData;
  reminders: Reminder[];
  completedAt: string | null;
  archivedAt: string | null;
  tags: string[];
  sourceType: SourceType;
  confidence: number;
  isFavorite: boolean;
}

export interface SearchFilter {
  query: string;
  category: Category | 'all';
  status: ItemStatus | 'all';
  dateFrom: string | null;
  dateTo: string | null;
  tags: string[];
}

export interface InsightSummary {
  totalItems: number;
  inboxCount: number;
  needsActionCount: number;
  completedCount: number;
  archivedCount: number;
  savedCount: number;
  rescuedCount: number;
  reminderSetCount: number;
  completedBeforeDeadline: number;
  completionRate: number;
  categoryBreakdown: Record<Category, number>;
  recentWeekAdded: number;
  recentMonthAdded: number;
  actionRate: number;
}

export interface ProcessingResult {
  ocrText: string;
  category: Category;
  title: string;
  extractedData: ExtractedData;
  confidence: number;
  suggestedTags: string[];
}

export interface AppSettings {
  onboardingComplete: boolean;
  defaultReminderHours: number;
  autoClassify: boolean;
  showSampleData: boolean;
}

export type TabId = 'home' | 'inbox' | 'actions' | 'search' | 'insights';

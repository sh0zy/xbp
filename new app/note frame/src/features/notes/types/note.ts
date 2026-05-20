export const NOTE_COLORS = ['indigo', 'emerald', 'amber', 'rose', 'slate'] as const;
export const THEME_MODES = ['dark', 'light', 'system'] as const;
export const SORT_ORDERS = ['updatedDesc', 'createdDesc', 'titleAsc'] as const;
export const NOTE_FILTERS = ['all', 'pinned', 'favorite', 'archived'] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];
export type NoteFilter = (typeof NOTE_FILTERS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface AppSettings {
  theme: ThemeMode;
  sortOrder: SortOrder;
  hasSeededDemo: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  sortOrder: 'updatedDesc',
  hasSeededDemo: false,
};

export const DEFAULT_NOTE_INPUT: NoteInput = {
  title: '',
  content: '',
  color: 'indigo',
  isPinned: false,
  isFavorite: false,
  isArchived: false,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isNoteColor = (value: unknown): value is NoteColor =>
  typeof value === 'string' && NOTE_COLORS.includes(value as NoteColor);

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && THEME_MODES.includes(value as ThemeMode);

export const isSortOrder = (value: unknown): value is SortOrder =>
  typeof value === 'string' && SORT_ORDERS.includes(value as SortOrder);

export const isNoteFilter = (value: unknown): value is NoteFilter =>
  typeof value === 'string' && NOTE_FILTERS.includes(value as NoteFilter);

export const isNote = (value: unknown): value is Note => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.content === 'string' &&
    isNoteColor(value.color) &&
    typeof value.isPinned === 'boolean' &&
    typeof value.isFavorite === 'boolean' &&
    typeof value.isArchived === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
};

export const isAppSettings = (value: unknown): value is AppSettings => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isThemeMode(value.theme) &&
    isSortOrder(value.sortOrder) &&
    typeof value.hasSeededDemo === 'boolean'
  );
};

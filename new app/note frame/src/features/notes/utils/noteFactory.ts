import { DEFAULT_NOTE_INPUT, type Note, type NoteInput } from '@/features/notes/types/note';

function createNoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createDraftInput(): NoteInput {
  return { ...DEFAULT_NOTE_INPUT };
}

export function createNote(input: NoteInput, now: string = new Date().toISOString()): Note {
  const title = input.title.trim();
  const content = input.content.trim();

  return {
    id: createNoteId(),
    title: title.length > 0 ? title : '無題のメモ',
    content,
    color: input.color,
    isPinned: input.isPinned,
    isFavorite: input.isFavorite,
    isArchived: input.isArchived,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateExistingNote(note: Note, input: NoteInput, now: string = new Date().toISOString()): Note {
  const title = input.title.trim();
  const content = input.content.trim();

  return {
    ...note,
    title: title.length > 0 ? title : '無題のメモ',
    content,
    color: input.color,
    isPinned: input.isPinned,
    isFavorite: input.isFavorite,
    isArchived: input.isArchived,
    updatedAt: now,
  };
}

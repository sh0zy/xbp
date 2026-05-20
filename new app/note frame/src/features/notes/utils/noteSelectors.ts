import type { Note, NoteFilter, SortOrder } from '@/features/notes/types/note';

function matchesQuery(note: Note, query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  const source = `${note.title}\n${note.content}`.toLocaleLowerCase('ja-JP');
  return source.includes(query.toLocaleLowerCase('ja-JP'));
}

function matchesFilter(note: Note, filter: NoteFilter): boolean {
  switch (filter) {
    case 'all':
      return !note.isArchived;
    case 'pinned':
      return note.isPinned && !note.isArchived;
    case 'favorite':
      return note.isFavorite && !note.isArchived;
    case 'archived':
      return note.isArchived;
    default:
      return !note.isArchived;
  }
}

function sortNotes(notes: Note[], sortOrder: SortOrder): Note[] {
  const cloned = [...notes];

  cloned.sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }

    switch (sortOrder) {
      case 'updatedDesc':
        return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
      case 'createdDesc':
        return Date.parse(right.createdAt) - Date.parse(left.createdAt);
      case 'titleAsc':
        return left.title.localeCompare(right.title, 'ja-JP');
      default:
        return 0;
    }
  });

  return cloned;
}

export function getHomeNoteGroups(notes: Note[], filter: NoteFilter, query: string, sortOrder: SortOrder): {
  pinnedNotes: Note[];
  regularNotes: Note[];
} {
  const visibleNotes = sortNotes(
    notes.filter((note) => matchesFilter(note, filter) && matchesQuery(note, query)),
    sortOrder,
  );

  if (filter === 'pinned') {
    return {
      pinnedNotes: visibleNotes,
      regularNotes: [],
    };
  }

  return {
    pinnedNotes: visibleNotes.filter((note) => note.isPinned),
    regularNotes: visibleNotes.filter((note) => !note.isPinned),
  };
}

export function getArchivedNotes(notes: Note[], query: string, sortOrder: SortOrder): Note[] {
  return sortNotes(notes.filter((note) => note.isArchived && matchesQuery(note, query)), sortOrder);
}

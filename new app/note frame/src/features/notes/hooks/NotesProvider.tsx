import { createContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { createDemoNotes } from '@/features/notes/services/demoNotes';
import { clearStorage, loadNotes, loadSettings, saveNotes, saveSettings } from '@/features/notes/services/storage';
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type Note,
  type NoteInput,
  type SortOrder,
  type ThemeMode,
} from '@/features/notes/types/note';
import { createNote, updateExistingNote } from '@/features/notes/utils/noteFactory';

interface NotesContextValue {
  isReady: boolean;
  notes: Note[];
  settings: AppSettings;
  getNoteById: (noteId: string) => Note | undefined;
  createNote: (input: NoteInput) => Promise<string>;
  updateNote: (noteId: string, input: NoteInput) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  restoreNote: (noteId: string) => Promise<void>;
  permanentlyDeleteNote: (noteId: string) => Promise<void>;
  updateTheme: (theme: ThemeMode) => Promise<void>;
  updateSortOrder: (sortOrder: SortOrder) => Promise<void>;
  regenerateDemoNotes: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const notesRef = useRef<Note[]>([]);
  const settingsRef = useRef<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    let isMounted = true;

    async function hydrate(): Promise<void> {
      const [storedNotes, storedSettings] = await Promise.all([loadNotes(), loadSettings()]);

      let nextNotes = storedNotes;
      let nextSettings = storedSettings;

      if (storedNotes.length === 0 && !storedSettings.hasSeededDemo) {
        nextNotes = createDemoNotes();
        nextSettings = {
          ...storedSettings,
          hasSeededDemo: true,
        };

        await Promise.all([saveNotes(nextNotes), saveSettings(nextSettings)]);
      }

      if (!isMounted) {
        return;
      }

      notesRef.current = nextNotes;
      settingsRef.current = nextSettings;
      setNotes(nextNotes);
      setSettings(nextSettings);
      setIsReady(true);
    }

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  async function commitNotes(nextNotes: Note[]): Promise<void> {
    notesRef.current = nextNotes;
    setNotes(nextNotes);
    await saveNotes(nextNotes);
  }

  async function commitSettings(nextSettings: AppSettings): Promise<void> {
    settingsRef.current = nextSettings;
    setSettings(nextSettings);
    await saveSettings(nextSettings);
  }

  async function createNoteEntry(input: NoteInput): Promise<string> {
    const note = createNote(input);
    await commitNotes([note, ...notesRef.current]);

    const nextSettings = {
      ...settingsRef.current,
      hasSeededDemo: true,
    };

    if (!settingsRef.current.hasSeededDemo) {
      await commitSettings(nextSettings);
    }

    return note.id;
  }

  async function updateNoteEntry(noteId: string, input: NoteInput): Promise<void> {
    const nextNotes = notesRef.current.map((note) =>
      note.id === noteId ? updateExistingNote(note, input) : note,
    );

    await commitNotes(nextNotes);
  }

  async function deleteNoteEntry(noteId: string): Promise<void> {
    const nextNotes = notesRef.current.filter((note) => note.id !== noteId);
    await commitNotes(nextNotes);
  }

  async function restoreArchivedNote(noteId: string): Promise<void> {
    const nextNotes = notesRef.current.map((note) =>
      note.id === noteId
        ? {
            ...note,
            isArchived: false,
            updatedAt: new Date().toISOString(),
          }
        : note,
    );

    await commitNotes(nextNotes);
  }

  async function updateTheme(theme: ThemeMode): Promise<void> {
    await commitSettings({
      ...settingsRef.current,
      theme,
    });
  }

  async function updateSortOrder(sortOrder: SortOrder): Promise<void> {
    await commitSettings({
      ...settingsRef.current,
      sortOrder,
    });
  }

  async function regenerateDemoNotes(): Promise<void> {
    const demoNotes = createDemoNotes();
    const nextSettings = {
      ...settingsRef.current,
      hasSeededDemo: true,
    };

    await Promise.all([commitNotes(demoNotes), commitSettings(nextSettings)]);
  }

  async function clearAllData(): Promise<void> {
    await clearStorage();

    const nextSettings: AppSettings = {
      ...DEFAULT_SETTINGS,
      hasSeededDemo: true,
    };

    notesRef.current = [];
    settingsRef.current = nextSettings;
    setNotes([]);
    setSettings(nextSettings);
    await saveSettings(nextSettings);
  }

  const value: NotesContextValue = {
    isReady,
    notes,
    settings,
    getNoteById: (noteId: string) => notes.find((note) => note.id === noteId),
    createNote: createNoteEntry,
    updateNote: updateNoteEntry,
    deleteNote: deleteNoteEntry,
    restoreNote: restoreArchivedNote,
    permanentlyDeleteNote: deleteNoteEntry,
    updateTheme,
    updateSortOrder,
    regenerateDemoNotes,
    clearAllData,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

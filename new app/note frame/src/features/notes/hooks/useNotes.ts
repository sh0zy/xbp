import { useContext } from 'react';
import { NotesContext } from '@/features/notes/hooks/NotesProvider';

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }

  return context;
}

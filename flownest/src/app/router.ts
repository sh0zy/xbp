export type Route =
  | { name: 'home' }
  | { name: 'templates'; mode: 'morning' | 'night' }
  | { name: 'editor'; templateId?: string; mode?: 'morning' | 'night' }
  | { name: 'run' }
  | { name: 'review' }
  | { name: 'settings' };

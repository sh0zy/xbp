export const spriteClasses = {
  player: 'sprite-player',
  minato: 'sprite-minato',
  yu: 'sprite-yu',
  absentee: 'sprite-absentee',
  librarian: 'sprite-librarian',
  clerk: 'sprite-clerk',
} as const;

export const portraitTones = {
  player: {
    background: 'var(--color-bg-overlay)',
    skin: 'var(--color-log-ink)',
    hair: 'var(--color-bg-deep)',
    outfit: 'var(--color-accent-blue)',
    accent: 'var(--color-text-secondary)',
    shadow: 'var(--color-border)',
  },
  minato: {
    background: 'var(--color-bg-surface)',
    skin: 'var(--color-text-secondary)',
    hair: 'var(--color-accent-glow)',
    outfit: 'var(--color-accent-blue)',
    accent: 'var(--color-text-primary)',
    shadow: 'var(--color-border)',
  },
  yu: {
    background: 'var(--color-log-paper)',
    skin: 'var(--color-log-ink)',
    hair: 'var(--color-text-muted)',
    outfit: 'var(--color-bg-overlay)',
    accent: 'var(--color-accent-glow)',
    shadow: 'var(--color-danger)',
  },
  absentee: {
    background: 'var(--color-bg-deep)',
    skin: 'var(--color-bg-deep)',
    hair: 'var(--color-bg-deep)',
    outfit: 'var(--color-bg-deep)',
    accent: 'var(--color-danger)',
    shadow: 'var(--color-border)',
  },
  librarian: {
    background: 'var(--color-bg-overlay)',
    skin: 'var(--color-log-ink)',
    hair: 'var(--color-text-muted)',
    outfit: 'var(--color-accent-blue)',
    accent: 'var(--color-text-primary)',
    shadow: 'var(--color-border)',
  },
  clerk: {
    background: 'var(--color-bg-surface)',
    skin: 'var(--color-text-muted)',
    hair: 'var(--color-bg-deep)',
    outfit: 'var(--color-bg-overlay)',
    accent: 'var(--color-log-ink)',
    shadow: 'var(--color-danger)',
  },
} as const;

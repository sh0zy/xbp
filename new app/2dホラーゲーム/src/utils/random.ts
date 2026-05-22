export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((part) => part.toString().padStart(2, '0')).join(':');
}

export function glitchText(text: string, amount = 0.08): string {
  const marks = ['█', '▓', '�'];
  return [...text]
    .map((char) => {
      if (char.trim().length === 0 || Math.random() > amount) {
        return char;
      }
      return marks[Math.floor(Math.random() * marks.length)];
    })
    .join('');
}

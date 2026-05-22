import type { Expression } from '../game/types';

export interface ExpressionStyle {
  eye: 'calm' | 'wide' | 'down' | 'hidden' | 'noise';
  brow: 'flat' | 'raised' | 'pinched' | 'gone';
  mouth: 'line' | 'open' | 'down' | 'none';
  filter?: 'glitch' | 'dim' | 'restored';
}

export const expressionStyles: Record<Expression, ExpressionStyle> = {
  neutral: { eye: 'calm', brow: 'flat', mouth: 'line' },
  worried: { eye: 'down', brow: 'pinched', mouth: 'down' },
  scared: { eye: 'wide', brow: 'raised', mouth: 'open' },
  shocked: { eye: 'wide', brow: 'raised', mouth: 'open', filter: 'dim' },
  tired: { eye: 'down', brow: 'flat', mouth: 'down', filter: 'dim' },
  silent: { eye: 'down', brow: 'gone', mouth: 'none', filter: 'dim' },
  glitched: { eye: 'noise', brow: 'gone', mouth: 'open', filter: 'glitch' },
  hidden: { eye: 'hidden', brow: 'gone', mouth: 'none', filter: 'dim' },
  restored: { eye: 'calm', brow: 'flat', mouth: 'line', filter: 'restored' },
};

export function getChapterOpacity(characterId: string, chapter: string): number {
  if (characterId !== 'yu') {
    return 1;
  }
  const order = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'final'];
  const index = Math.max(0, order.indexOf(chapter));
  return [0.18, 0.3, 0.52, 0.72, 0.9, 1][index] ?? 0.3;
}

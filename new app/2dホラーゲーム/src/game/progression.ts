import type { AmbientName } from '../audio/ambient';
import { FINAL_CORRECT_NAME } from './constants';
import { importantLogIds } from './logs';
import { maps } from './maps';
import { puzzles } from './puzzles';
import type { ChapterId, PuzzleData, SaveData } from './types';

const criticalEndingLogs = [
  'notice_gate',
  'attendance_sheet',
  'unsent_mail',
  'library_card',
  'returned_note',
  'student_affairs_black',
  'camera_5',
  'photo_a',
  'photo_b',
  'seminar_roster',
  'rooftop_security',
  'final_attendance',
];

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function isPuzzleAnswerCorrect(puzzle: PuzzleData, value: string | string[]): boolean {
  if (Array.isArray(puzzle.answer)) {
    if (Array.isArray(value)) {
      return puzzle.answer.join('|') === value.join('|');
    }
    return puzzle.answer.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(value));
  }
  if (Array.isArray(value)) {
    return false;
  }
  return normalizeAnswer(puzzle.answer) === normalizeAnswer(value);
}

export function getChapterForMap(mapId: string): ChapterId {
  return maps[mapId]?.chapter ?? 'prologue';
}

export function getAmbientForChapter(chapter: ChapterId): AmbientName {
  if (chapter === 'prologue' || chapter === 'chapter1') {
    return 'campus';
  }
  if (chapter === 'chapter2') {
    return 'library';
  }
  if (chapter === 'chapter3') {
    return 'office';
  }
  if (chapter === 'chapter4') {
    return 'basement';
  }
  return 'final';
}

export function isCriticalLogComplete(data: SaveData): boolean {
  return criticalEndingLogs.every((id) => data.collectedLogs.includes(id));
}

export function getEndingForFinalName(data: SaveData, answer: string, wasCorrect: boolean): 'endingA' | 'endingB' | 'endingC' {
  if (!wasCorrect) {
    return 'endingB';
  }
  if (!isCriticalLogComplete(data) || data.collectedLogs.filter((id) => importantLogIds.includes(id)).length < 10) {
    return 'endingA';
  }
  if (normalizeAnswer(answer) === normalizeAnswer(FINAL_CORRECT_NAME) || normalizeAnswer(answer) === 'sakaki yu') {
    return 'endingC';
  }
  return 'endingB';
}

export function getCurrentPuzzleHint(data: SaveData): string {
  const currentMap = maps[data.currentMapId];
  const puzzlePoint = currentMap.points.find((point) => point.kind === 'puzzle' && point.puzzleId && !data.solvedPuzzles.includes(point.puzzleId));
  if (!puzzlePoint?.puzzleId) {
    return currentMap.objective;
  }
  const puzzle = puzzles[puzzlePoint.puzzleId];
  const level = data.hintLevels[puzzle.id] ?? 0;
  return puzzle.hints[Math.min(level, puzzle.hints.length - 1)] ?? currentMap.objective;
}

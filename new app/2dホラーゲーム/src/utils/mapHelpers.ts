import type { InvestigationPoint, MapData, Point } from '../game/types';
import { distance } from './collision';

export function getNearestPoint(map: MapData, player: Point): InvestigationPoint | undefined {
  return map.points
    .filter((point) => distance(point, player) <= (point.radius ?? 1.35))
    .sort((a, b) => distance(a, player) - distance(b, player))[0];
}

export function hasRequirements(
  point: InvestigationPoint,
  collectedLogs: string[],
  inventory: string[],
  solvedPuzzles: string[],
): boolean {
  const logOk = point.requiredLogIds?.every((id) => collectedLogs.includes(id)) ?? true;
  const itemOk = point.requiredItemIds?.every((id) => inventory.includes(id)) ?? true;
  const puzzleOk = point.requiredPuzzleIds?.every((id) => solvedPuzzles.includes(id)) ?? true;
  return logOk && itemOk && puzzleOk;
}

export function isHiddenPoint(
  point: InvestigationPoint,
  collectedLogs: string[],
  inventory: string[],
  solvedPuzzles: string[],
): boolean {
  if (!point.hiddenUntil) {
    return false;
  }
  const logs = point.hiddenUntil.logs?.every((id) => collectedLogs.includes(id)) ?? true;
  const items = point.hiddenUntil.items?.every((id) => inventory.includes(id)) ?? true;
  const puzzles = point.hiddenUntil.puzzles?.every((id) => solvedPuzzles.includes(id)) ?? true;
  return !(logs && items && puzzles);
}

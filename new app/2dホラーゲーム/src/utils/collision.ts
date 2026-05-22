import type { MapData, Point } from '../game/types';

const BLOCKING_TILES = new Set(['#', 'X']);

export function tileAt(map: MapData, point: Point): string {
  if (point.x < 0 || point.y < 0 || point.x >= map.width || point.y >= map.height) {
    return '#';
  }
  return map.tiles[point.y]?.[point.x] ?? '#';
}

export function isWalkable(map: MapData, point: Point): boolean {
  return !BLOCKING_TILES.has(tileAt(map, point));
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function near(a: Point, b: Point, radius = 1.35): boolean {
  return distance(a, b) <= radius;
}

import type { EquipmentId, MatchConfig, Piece, PlayerId, StageData } from '../types';
import { composeStats } from '../data/equipments';

export const BASE_RADIUS = 16;
export const BASE_MASS = 1;

/** 初期配置を作成: P1は下側、P2は上側に並べる */
export function createInitialPieces(config: MatchConfig, stage: StageData): Piece[] {
  const pieces: Piece[] = [];
  const n = config.pieceCount;
  const gap = stage.width / (n + 1);

  for (let i = 0; i < n; i++) {
    const x = gap * (i + 1);
    for (const owner of [1, 2] as PlayerId[]) {
      const y = owner === 1 ? stage.height - 60 : 60;
      const eqs = config.loadouts[owner]?.[i] ?? [];
      const stats = composeStats(BASE_RADIUS, BASE_MASS, eqs);
      pieces.push({
        id: `${owner}-${i}`,
        owner,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: stats.radius,
        mass: stats.mass,
        equipments: eqs.slice(0, 2),
        alive: true,
      });
    }
  }
  return pieces;
}

export function aliveCount(pieces: Piece[], owner: PlayerId): number {
  return pieces.filter((p) => p.alive && p.owner === owner).length;
}

export function checkWinner(pieces: Piece[]): PlayerId | null {
  const a = aliveCount(pieces, 1);
  const b = aliveCount(pieces, 2);
  if (a === 0 && b === 0) return 1; // 同時全滅は攻撃側(直前ターン)勝ち扱い
  if (a === 0) return 2;
  if (b === 0) return 1;
  return null;
}

/** 装備→摩擦/反発の辞書を作る。RPG用の extra*Scale があれば乗算で重ねる。 */
export function buildModifierMaps(pieces: Piece[]) {
  const frictionByPiece: Record<string, number> = {};
  const bounceByPiece: Record<string, number> = {};
  const powerByPiece: Record<string, number> = {};
  for (const p of pieces) {
    const stats = composeStats(BASE_RADIUS, BASE_MASS, p.equipments);
    const stabScale = p.extraStabilityScale ?? 1;
    const bounceScale = p.extraBounceScale ?? 1;
    const powerScale = p.extraPowerScale ?? 1;
    // stability>1 → 少し止まりにくい (stage摩擦に対する補正倍率)
    frictionByPiece[p.id] = 1 + 0.01 * (stats.friction * stabScale - 1);
    bounceByPiece[p.id] = stats.bounce * bounceScale;
    powerByPiece[p.id] = stats.power * powerScale;
  }
  return { frictionByPiece, bounceByPiece, powerByPiece };
}

export function defaultLoadouts(pieceCount: number, equip: EquipmentId): EquipmentId[][] {
  return Array.from({ length: pieceCount }, () => [equip]);
}

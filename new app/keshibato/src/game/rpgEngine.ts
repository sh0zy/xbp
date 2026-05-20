import type { EnemyData, EquipmentId, Piece, PlayerId, RpgStageData, StageData } from '../types';
import { BASE_MASS, BASE_RADIUS } from './engine';
import { composeStats } from '../data/equipments';
import { getEnemy } from '../data/rpgEnemies';
import { computeStreakBonus } from '../utils/ai';

/** RpgStageData → 既存 StageData に合わせる(Boardコンポーネントで使うため) */
export function rpgStageToStageData(r: RpgStageData): StageData {
  return {
    id: `rpg-${r.level}`,
    name: `${r.theme} Lv${r.level}`,
    description: r.theme,
    width: r.width,
    height: r.height,
    obstacles: r.obstacles,
    friction: r.friction,
    theme: r.bossStage ? 'bumper' : 'normal',
    unlockCondition: 'rpg',
  };
}

/** レベルに応じた全体強化倍率(30,80,150,300,499 に閾値を置く) */
export function levelScaling(level: number) {
  // 1:1.0 / 30:1.08 / 80:1.15 / 150:1.25 / 300:1.4 / 499:1.6 / 500:1.75
  const table = [
    [1, 1.0], [30, 1.08], [80, 1.15], [150, 1.25], [300, 1.4], [499, 1.6], [500, 1.75],
  ] as const;
  let base = table[0][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [l0, v0] = table[i];
    const [l1, v1] = table[i + 1];
    if (level >= l0 && level <= l1) {
      const t = (level - l0) / Math.max(1, l1 - l0);
      base = v0 + (v1 - v0) * t;
      break;
    }
  }
  return base;
}

export interface CreateRpgPiecesOpts {
  playerLoadout: EquipmentId[][]; // プレイヤーのコマ別装備
  enemyIds: string[];             // 敵ID(1〜3)
  rpgStage: RpgStageData;
  /** CPU連勝相当のボーナス(RPG内では進行段階やボス討伐数を利用) */
  streakLikeBonus: number;
}

/** RPG戦闘の初期配置を作る: 敵はEnemyDataのスケールと連勝ボーナスをextra*Scaleで反映する */
export function createRpgPieces(opts: CreateRpgPiecesOpts): Piece[] {
  const { playerLoadout, enemyIds, rpgStage, streakLikeBonus } = opts;
  const { width, height, level } = rpgStage;
  const pieces: Piece[] = [];
  const playerCount = Math.max(1, playerLoadout.length);
  const enemyCount = Math.max(1, enemyIds.length);

  const gapP = width / (playerCount + 1);
  for (let i = 0; i < playerCount; i++) {
    const eqs = playerLoadout[i].slice(0, 2);
    const stats = composeStats(BASE_RADIUS, BASE_MASS, eqs);
    pieces.push({
      id: `1-${i}`,
      owner: 1 as PlayerId,
      x: gapP * (i + 1),
      y: height - 60,
      vx: 0,
      vy: 0,
      radius: stats.radius,
      mass: stats.mass,
      equipments: eqs,
      alive: true,
    });
  }

  // 敵スケール = 個体 * レベル全体 * 連勝相当ボーナス
  const lvScale = levelScaling(level);
  const bonus = computeStreakBonus(streakLikeBonus);
  const gapE = width / (enemyCount + 1);

  enemyIds.forEach((eid, i) => {
    const e: EnemyData = getEnemy(eid);
    // 敵個体の持つpower/stability/speedをここでスケーリング
    const pScale = e.powerScale * lvScale * bonus.powerBonus;
    const stScale = e.stabilityScale * (1 + (lvScale - 1) * 0.5) * bonus.massBonus;
    const mScale = (e.isBoss ? 1.25 : 1) * bonus.massBonus * (1 + (lvScale - 1) * 0.35);
    const rScale = e.isBoss ? 1.18 : 1;
    pieces.push({
      id: `2-${i}`,
      owner: 2 as PlayerId,
      x: gapE * (i + 1),
      y: 60,
      vx: 0,
      vy: 0,
      radius: BASE_RADIUS * rScale,
      mass: BASE_MASS * mScale,
      equipments: [],
      alive: true,
      extraPowerScale: pScale,
      extraStabilityScale: stScale,
      extraBounceScale: 1 + (e.speedScale - 1) * 0.3,
      extraMassScale: mScale,
      extraRadiusScale: rScale,
      aiStyle: e.aiStyle,
      enemyId: e.id,
      tint: e.baseColor,
    });
  });

  return pieces;
}

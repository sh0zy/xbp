import type { FallEdge, Piece, StageData } from '../types';

/** 1ステップの時間(秒相当。簡易なので単位はゆるめ) */
export const DT = 1;
/** 速度がこれ以下なら停止扱い */
export const STOP_THRESHOLD = 0.08;
/** 1回の発射で与える最大初速 */
export const MAX_LAUNCH_SPEED = 14;
/** シミュレーション最大フレーム(暴発防止) */
export const MAX_SIM_FRAMES = 360;

export interface SimOptions {
  stage: StageData;
  /** コマ個別の摩擦倍率(装備由来) */
  frictionByPiece: Record<string, number>;
  /** コマ個別の反発倍率(装備由来) */
  bounceByPiece: Record<string, number>;
}

export function step(pieces: Piece[], opts: SimOptions): Piece[] {
  const { stage, frictionByPiece, bounceByPiece } = opts;
  const next = pieces.map((p) => ({ ...p }));

  // 1) 位置更新
  for (const p of next) {
    if (!p.alive) continue;
    p.x += p.vx * DT;
    p.y += p.vy * DT;
  }

  // 2) 障害物との衝突(円同士として解決)
  for (const p of next) {
    if (!p.alive) continue;
    for (const o of stage.obstacles) {
      const dx = p.x - o.x;
      const dy = p.y - o.y;
      const d = Math.hypot(dx, dy);
      const min = p.radius + o.r;
      if (d < min && d > 0) {
        const nx = dx / d;
        const ny = dy / d;
        const overlap = min - d;
        p.x += nx * overlap;
        p.y += ny * overlap;
        const vDotN = p.vx * nx + p.vy * ny;
        const bump = o.kind === 'bumper' ? 1.4 : 1.0;
        const b = (bounceByPiece[p.id] ?? 1) * 0.9 * bump;
        p.vx -= (1 + b) * vDotN * nx;
        p.vy -= (1 + b) * vDotN * ny;
      }
    }
  }

  // 3) コマ同士の衝突
  for (let i = 0; i < next.length; i++) {
    const a = next[i];
    if (!a.alive) continue;
    for (let j = i + 1; j < next.length; j++) {
      const b = next[j];
      if (!b.alive) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const min = a.radius + b.radius;
      if (d < min && d > 0) {
        const nx = dx / d;
        const ny = dy / d;
        const overlap = min - d;
        const totalMass = a.mass + b.mass;
        a.x -= nx * overlap * (b.mass / totalMass);
        a.y -= ny * overlap * (b.mass / totalMass);
        b.x += nx * overlap * (a.mass / totalMass);
        b.y += ny * overlap * (a.mass / totalMass);

        const rvx = b.vx - a.vx;
        const rvy = b.vy - a.vy;
        const velAlong = rvx * nx + rvy * ny;
        if (velAlong > 0) continue;
        const bounce = ((bounceByPiece[a.id] ?? 1) + (bounceByPiece[b.id] ?? 1)) * 0.5;
        const e = 0.85 * bounce;
        const jImp = (-(1 + e) * velAlong) / (1 / a.mass + 1 / b.mass);
        const ix = jImp * nx;
        const iy = jImp * ny;
        a.vx -= ix / a.mass;
        a.vy -= iy / a.mass;
        b.vx += ix / b.mass;
        b.vy += iy / b.mass;
      }
    }
  }

  // 4) 摩擦 & 場外判定
  for (const p of next) {
    if (!p.alive) continue;
    const friction = stage.friction * (frictionByPiece[p.id] ?? 1);
    // 摩擦は 0.985^個別倍率 相当でなく乗算にとどめる
    p.vx *= friction;
    p.vy *= friction;
    if (Math.abs(p.vx) < STOP_THRESHOLD) p.vx = 0;
    if (Math.abs(p.vy) < STOP_THRESHOLD) p.vy = 0;

    // 場外(フチを半径分はみ出したら落下開始)
    const margin = p.radius * 0.4;
    let edge: FallEdge | null = null;
    if (p.x < -margin) edge = 'left';
    else if (p.x > stage.width + margin) edge = 'right';
    else if (p.y < -margin) edge = 'top';
    else if (p.y > stage.height + margin) edge = 'bottom';
    if (edge) {
      p.alive = false;
      p.fallStart = performance.now();
      p.fallEdge = edge;
      // 最後の速度を少し残すと「押し出された感」が出るが、物理への影響は切る
      p.vx = 0;
      p.vy = 0;
    }
  }

  return next;
}

export function allStopped(pieces: Piece[]): boolean {
  return pieces.every((p) => !p.alive || (p.vx === 0 && p.vy === 0));
}

/** ドラッグベクトル (pullX, pullY) から発射速度を計算 */
export function computeLaunchVelocity(pullX: number, pullY: number, power: number) {
  const len = Math.hypot(pullX, pullY);
  if (len < 2) return { vx: 0, vy: 0, speed: 0 };
  const clamped = Math.min(len, 120);
  const speed = (clamped / 120) * MAX_LAUNCH_SPEED * power;
  const nx = -pullX / len;
  const ny = -pullY / len;
  return { vx: nx * speed, vy: ny * speed, speed };
}

import type { Piece, PlayerId, StageData, CpuLevel, EnemyAIStyle } from '../types';

export type AiDifficulty = CpuLevel;

export const CPU_LEVEL_ORDER: CpuLevel[] = [
  'beginner', 'easy', 'normal', 'hard', 'veryhard', 'extreme', 'nightmare',
];

export const CPU_LEVEL_META: Record<CpuLevel, {
  rank: number;          // 1〜7
  label: string;
  shortLabel: string;
  hint: string;
}> = {
  beginner: { rank: 1, label: 'Lv1 Beginner',  shortLabel: 'Beg',  hint: 'かなりやさしい' },
  easy:     { rank: 2, label: 'Lv2 Easy',      shortLabel: 'Easy', hint: '初心者向け' },
  normal:   { rank: 3, label: 'Lv3 Normal',    shortLabel: 'Nml',  hint: '標準' },
  hard:     { rank: 4, label: 'Lv4 Hard',      shortLabel: 'Hard', hint: '手強い' },
  veryhard: { rank: 5, label: 'Lv5 Very Hard', shortLabel: 'VH',   hint: 'かなり強い' },
  extreme:  { rank: 6, label: 'Lv6 Extreme',   shortLabel: 'EX',   hint: '容赦なし' },
  nightmare:{ rank: 7, label: 'Lv7 Nightmare', shortLabel: 'NM',   hint: '理不尽でもよい最上位' },
};

/** CPU連勝ボーナス(0連勝=0)。後半で大きくなり、補正は乗算で適用する。 */
export interface StreakBonus {
  /** 精度(ノイズ)削減倍率 1=変化なし, 0.5=ノイズ半分 */
  accuracyBonus: number;
  /** 発射力倍率 */
  powerBonus: number;
  /** 重量/安定性倍率 */
  massBonus: number;
}

export function computeStreakBonus(streak: number): StreakBonus {
  // 1〜2連勝: 少し精度アップ / 3〜4: パワーも上乗せ / 5+: 重さと安定性も盛る
  const s = Math.max(0, streak | 0);
  const accuracy = s >= 5 ? 0.45 : s >= 3 ? 0.7 : s >= 1 ? 0.85 : 1;
  const power = 1 + Math.min(0.35, s * 0.06);
  const mass = s >= 5 ? 1.15 : s >= 3 ? 1.08 : 1;
  return { accuracyBonus: accuracy, powerBonus: power, massBonus: mass };
}

export interface AiPickOpts {
  /** 敵個体のAI傾向(RPG敵用) */
  aiStyle?: EnemyAIStyle;
  /** CPUレベル(強いほど落下優先の判断が賢くなる) */
  level?: CpuLevel;
}

/** 狙い先の候補: 相手コマを敵端からの近さでスコアリング */
export function pickAITarget(
  pieces: Piece[],
  cpu: PlayerId,
  stage: StageData,
  opts: AiPickOpts = {}
): { attacker: Piece; target: Piece } | null {
  const myPieces = pieces.filter((p) => p.alive && p.owner === cpu);
  const enemies = pieces.filter((p) => p.alive && p.owner !== cpu);
  if (myPieces.length === 0 || enemies.length === 0) return null;

  // 端からの近さ(落とされやすい相手ほど高スコア)
  const edgeScore = (p: Piece) => {
    const dx = Math.min(p.x, stage.width - p.x);
    const dy = Math.min(p.y, stage.height - p.y);
    return -Math.min(dx, dy);
  };

  const style = opts.aiStyle ?? 'balanced';
  const level = opts.level ?? 'normal';
  const levelRank = CPU_LEVEL_META[level].rank;

  // レベル3以下ではランダム寄り, 4以上では的確に端の敵を狙う
  let target: Piece;
  if (style === 'defensive') {
    target = [...enemies].sort((a, b) => edgeScore(b) - edgeScore(a))[0];
  } else if (style === 'trick') {
    target = enemies[Math.floor(Math.random() * enemies.length)];
  } else if (style === 'reckless') {
    target = [...enemies].sort((a, b) => b.x - a.x)[0];
  } else if (levelRank <= 2) {
    // Beginner/Easy: ほぼランダム
    target = enemies[Math.floor(Math.random() * enemies.length)];
  } else if (levelRank === 3) {
    // Normal: 半々でベストか近い敵
    target = Math.random() < 0.6
      ? [...enemies].sort((a, b) => edgeScore(b) - edgeScore(a))[0]
      : enemies[Math.floor(Math.random() * enemies.length)];
  } else {
    // Hard+: 確実に端に居る敵 (落下優先度)
    target = [...enemies].sort((a, b) => edgeScore(b) - edgeScore(a))[0];
  }

  // 危険地帯の回避: 上位レベルは自陣コマの中でも中央寄りを優先的に使う
  const safeScore = (p: Piece) => {
    const dx = Math.min(p.x, stage.width - p.x);
    const dy = Math.min(p.y, stage.height - p.y);
    return Math.min(dx, dy);
  };
  const nearTarget = (p: Piece) => Math.hypot(p.x - target.x, p.y - target.y);

  let attacker: Piece;
  if (style === 'defensive') {
    attacker = myPieces.sort((a, b) => (a.x - stage.width / 2) ** 2 - (b.x - stage.width / 2) ** 2)[0];
  } else if (levelRank >= 5) {
    // 強レベル: 端に居る自分コマを避けつつ標的に近いコマを選ぶ
    attacker = [...myPieces].sort(
      (a, b) => (nearTarget(a) - safeScore(a) * 0.4) - (nearTarget(b) - safeScore(b) * 0.4)
    )[0];
  } else {
    attacker = [...myPieces].sort((a, b) => nearTarget(a) - nearTarget(b))[0];
  }

  return { attacker, target };
}

export interface AiLaunchOpts {
  streak?: number;
  aiStyle?: EnemyAIStyle;
}

/** 攻撃ベクトル計算: 対象を貫通するように方向を決め、難易度+連勝で揺らす */
export function computeAILaunch(
  attacker: Piece,
  target: Piece,
  difficulty: AiDifficulty,
  power: number,
  opts: AiLaunchOpts = {}
) {
  const dx = target.x - attacker.x;
  const dy = target.y - attacker.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;

  // 難易度で精度と強さを調整 (7段階)
  const noiseMap: Record<AiDifficulty, number> = {
    beginner: 0.42,
    easy: 0.28,
    normal: 0.14,
    hard: 0.06,
    veryhard: 0.02,
    extreme: 0.008,
    nightmare: 0.002,
  };
  const speedMap: Record<AiDifficulty, number> = {
    beginner: 0.55,
    easy: 0.72,
    normal: 0.88,
    hard: 1.0,
    veryhard: 1.1,
    extreme: 1.2,
    nightmare: 1.32,
  };
  // 連勝ボーナスの効きやすさ(強いCPUほど敏感に反応)
  const streakSensitivity: Record<AiDifficulty, number> = {
    beginner: 0.3, easy: 0.55, normal: 0.8, hard: 1.0, veryhard: 1.15, extreme: 1.3, nightmare: 1.5,
  };
  let noise = noiseMap[difficulty];
  let s = speedMap[difficulty];

  // 連勝ボーナス適用 (強いCPUほど敏感)
  const bonus = computeStreakBonus(opts.streak ?? 0);
  const sens = streakSensitivity[difficulty];
  noise *= 1 - (1 - bonus.accuracyBonus) * sens;
  s *= 1 + (bonus.powerBonus - 1) * sens;

  // スタイルでさらに微調整
  if (opts.aiStyle === 'aggressive') s *= 1.05;
  if (opts.aiStyle === 'reckless') { s *= 1.1; noise *= 1.5; }
  if (opts.aiStyle === 'trick') noise *= 1.3;
  if (opts.aiStyle === 'defensive') s *= 0.9;

  const jx = nx + (Math.random() - 0.5) * noise;
  const jy = ny + (Math.random() - 0.5) * noise;
  const jlen = Math.hypot(jx, jy) || 1;

  const speed = 14 * s * power;
  return { vx: (jx / jlen) * speed, vy: (jy / jlen) * speed, attackerId: attacker.id };
}

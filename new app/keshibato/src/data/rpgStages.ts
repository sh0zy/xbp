import type { RpgStageData } from '../types';

/**
 * RPGモード500ステージの生成器。
 * テーマは区間固定で連続、難易度は区間内でも徐々に上がる。
 * 敵プールは mutationStage に応じて段階的に切り替わる。
 */

interface Zone {
  start: number;
  end: number;
  theme: string;
  themeGroup: string;
  /** 見た目の段階 0〜4 */
  mutationStage: 0 | 1 | 2 | 3 | 4;
  /** 盤面テンプレート */
  boardBase: { width: number; height: number; friction: number };
  /** 障害物量 0〜5 */
  obstacleBudget: number;
  /** バンパー率 0〜1 */
  bumperRate: number;
  /** 狭さ 0〜1 */
  narrowness: number;
  /** 滑りやすさ 0〜1 */
  slipperiness: number;
  /** その区間で出やすい敵 id */
  enemyPool: string[];
}

const ZONES: Zone[] = [
  { start: 1, end: 10, theme: '学校机', themeGroup: 'desk-school', mutationStage: 0,
    boardBase: { width: 360, height: 560, friction: 0.968 }, obstacleBudget: 0, bumperRate: 0, narrowness: 0, slipperiness: 0,
    enemyPool: ['slime', 'babySlime', 'puniDama'] },
  { start: 11, end: 20, theme: 'ノートの上', themeGroup: 'notebook', mutationStage: 0,
    boardBase: { width: 340, height: 560, friction: 0.965 }, obstacleBudget: 1, bumperRate: 0, narrowness: 0.1, slipperiness: 0,
    enemyPool: ['chibiRock', 'hiyokoStone', 'noteSoldier'] },
  { start: 21, end: 30, theme: '教室', themeGroup: 'classroom', mutationStage: 0,
    boardBase: { width: 340, height: 560, friction: 0.965 }, obstacleBudget: 2, bumperRate: 0, narrowness: 0.1, slipperiness: 0.05,
    enemyPool: ['inkDrop', 'featherPen', 'kesikasu'] },
  { start: 31, end: 40, theme: 'やさしい盤面', themeGroup: 'easy-board', mutationStage: 0,
    boardBase: { width: 340, height: 560, friction: 0.968 }, obstacleBudget: 1, bumperRate: 0.1, narrowness: 0.1, slipperiness: 0,
    enemyPool: ['marunomiMemo', 'crayonKoron', 'chibiCompass'] },
  { start: 41, end: 50, theme: '放課後机', themeGroup: 'after-school', mutationStage: 0,
    boardBase: { width: 340, height: 560, friction: 0.962 }, obstacleBudget: 2, bumperRate: 0.1, narrowness: 0.15, slipperiness: 0.05,
    enemyPool: ['nobiNote', 'chalkKun', 'petaFusen', 'koroRuler', 'fuwaSponge', 'miniBlackboard'] },

  { start: 51, end: 70, theme: '黒板前', themeGroup: 'blackboard', mutationStage: 1,
    boardBase: { width: 330, height: 560, friction: 0.96 }, obstacleBudget: 2, bumperRate: 0.15, narrowness: 0.2, slipperiness: 0.1,
    enemyPool: ['shisa', 'stoneSoldier', 'blueOniMask', 'tapeMan', 'fusenGhost'] },
  { start: 71, end: 100, theme: '廊下風', themeGroup: 'hallway', mutationStage: 1,
    boardBase: { width: 310, height: 570, friction: 0.96 }, obstacleBudget: 3, bumperRate: 0.2, narrowness: 0.3, slipperiness: 0.1,
    enemyPool: ['merlion', 'redOniMask', 'windLizard', 'sandBeast', 'clipSnake'] },
  { start: 101, end: 150, theme: '古い教室', themeGroup: 'old-classroom', mutationStage: 1,
    boardBase: { width: 320, height: 580, friction: 0.955 }, obstacleBudget: 3, bumperRate: 0.25, narrowness: 0.3, slipperiness: 0.15,
    enemyPool: ['ancientScribe', 'armorDaruma', 'blackBeetle', 'thunderOrb', 'inkDragon', 'deepDrop', 'lavaGolem'] },

  { start: 151, end: 200, theme: '夜の教室', themeGroup: 'night-classroom', mutationStage: 2,
    boardBase: { width: 310, height: 580, friction: 0.955 }, obstacleBudget: 3, bumperRate: 0.3, narrowness: 0.35, slipperiness: 0.2,
    enemyPool: ['cursedMerlion', 'maShisa', 'gargoyle', 'blackboardGhost'] },
  { start: 201, end: 250, theme: '崩れた机上', themeGroup: 'broken-desk', mutationStage: 2,
    boardBase: { width: 300, height: 580, friction: 0.95 }, obstacleBudget: 4, bumperRate: 0.35, narrowness: 0.4, slipperiness: 0.25,
    enemyPool: ['calamityStatue', 'boneKnight', 'compassBeast', 'binderTitan'] },
  { start: 251, end: 300, theme: '不気味な文具空間', themeGroup: 'weird-stationery', mutationStage: 2,
    boardBase: { width: 300, height: 590, friction: 0.95 }, obstacleBudget: 4, bumperRate: 0.35, narrowness: 0.45, slipperiness: 0.3,
    enemyPool: ['abyssInk', 'shardNoteKing', 'gargoyle', 'boneKnight'] },

  { start: 301, end: 350, theme: '異界教室', themeGroup: 'otherworld', mutationStage: 3,
    boardBase: { width: 290, height: 590, friction: 0.948 }, obstacleBudget: 4, bumperRate: 0.4, narrowness: 0.5, slipperiness: 0.35,
    enemyPool: ['abyssSlime', 'endNoteSoldier', 'beetleKing'] },
  { start: 351, end: 400, theme: '深淵ノート領域', themeGroup: 'abyss-note', mutationStage: 3,
    boardBase: { width: 280, height: 600, friction: 0.945 }, obstacleBudget: 5, bumperRate: 0.45, narrowness: 0.55, slipperiness: 0.4,
    enemyPool: ['facelessGuardian', 'judgeMask', 'abyssSlime'] },
  { start: 401, end: 450, theme: '崩壊机領域', themeGroup: 'collapse', mutationStage: 3,
    boardBase: { width: 280, height: 600, friction: 0.94 }, obstacleBudget: 5, bumperRate: 0.5, narrowness: 0.6, slipperiness: 0.45,
    enemyPool: ['abyssSlimeVariant', 'blackFlameNote', 'facelessServant', 'beetleKingFang'] },
  { start: 451, end: 499, theme: '終末ステージ', themeGroup: 'end-times', mutationStage: 4,
    boardBase: { width: 270, height: 610, friction: 0.94 }, obstacleBudget: 5, bumperRate: 0.55, narrowness: 0.65, slipperiness: 0.5,
    enemyPool: ['judgeMaskSplit', 'beetleKingFang', 'facelessServant', 'blackFlameNote', 'abyssSlimeVariant'] },
  { start: 500, end: 500, theme: 'ラスボス専用空間', themeGroup: 'final', mutationStage: 4,
    boardBase: { width: 280, height: 600, friction: 0.94 }, obstacleBudget: 3, bumperRate: 0.4, narrowness: 0.6, slipperiness: 0.4,
    enemyPool: [] },
];

const BOSS_MAP: Record<number, string> = {
  50: 'boss_shisa_giant',
  150: 'boss_merlion_cursed',
  300: 'boss_slime_king',
  500: 'boss_keshigon',
};

/** 擬似乱数(ステージ番号でシード) — 同じLvでは毎回同じ盤面が出る */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function zoneFor(level: number): Zone {
  return ZONES.find((z) => level >= z.start && level <= z.end) ?? ZONES[0];
}

/** 区間内進捗 0〜1 */
function zoneProgress(level: number, z: Zone): number {
  if (z.end === z.start) return 0;
  return (level - z.start) / (z.end - z.start);
}

/** 雑魚編成を作る: 終盤ほど複数体になりやすい */
function pickEnemies(level: number, z: Zone, rnd: () => number): string[] {
  if (BOSS_MAP[level]) return [BOSS_MAP[level]];
  const pool = z.enemyPool.length > 0 ? z.enemyPool : ['slime'];
  const prog = zoneProgress(level, z);
  // 1体/2体/3体編成の比率を徐々に変える
  const r = rnd();
  let count: 1 | 2 | 3;
  if (level < 30) count = 1;
  else if (level < 100) count = r < 0.7 ? 1 : 2;
  else if (level < 200) count = r < 0.45 ? 1 : r < 0.85 ? 2 : 3;
  else if (level < 350) count = r < 0.2 ? 1 : r < 0.65 ? 2 : 3;
  else count = r < 0.1 ? 1 : r < 0.45 ? 2 : 3;

  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rnd() * pool.length * (0.6 + prog * 0.4));
    ids.push(pool[idx % pool.length]);
  }
  return ids;
}

function buildObstacles(level: number, z: Zone, rnd: () => number) {
  const prog = zoneProgress(level, z);
  const n = Math.min(8, Math.floor(z.obstacleBudget + prog * 2));
  const { width, height } = z.boardBase;
  const out: Array<{ x: number; y: number; r: number; kind?: 'block' | 'bumper' }> = [];
  for (let i = 0; i < n; i++) {
    const x = 40 + rnd() * (width - 80);
    const y = 120 + rnd() * (height - 240);
    const kind = rnd() < z.bumperRate ? 'bumper' : 'block';
    const r = kind === 'bumper' ? 18 + rnd() * 6 : 14 + rnd() * 10;
    out.push({ x, y, r, kind });
  }
  return out;
}

/** 指定レベルのステージを構築(500レベル分) */
export function buildRpgStage(level: number): RpgStageData {
  const lv = Math.max(1, Math.min(500, level | 0));
  const z = zoneFor(lv);
  const rnd = mulberry32(lv * 9973);
  const prog = zoneProgress(lv, z);

  // 区間内での微調整 — 難易度で盤面も細くなる
  const width = Math.round(z.boardBase.width - prog * 10 - (lv > 300 ? (lv - 300) * 0.02 : 0));
  const height = z.boardBase.height;
  const friction = Math.max(0.93, z.boardBase.friction - prog * 0.003 - (lv > 400 ? 0.002 : 0));

  const isBoss = BOSS_MAP[lv] !== undefined;
  const obstacles = isBoss
    ? buildObstacles(lv, z, rnd).slice(0, Math.max(1, Math.floor(z.obstacleBudget * 0.8)))
    : buildObstacles(lv, z, rnd);

  return {
    level: lv,
    theme: z.theme,
    themeGroup: z.themeGroup,
    width,
    height,
    friction,
    obstacles,
    hazardLevel: Math.min(5, Math.floor(lv / 100) + z.mutationStage),
    narrowness: z.narrowness + prog * 0.05,
    slipperiness: z.slipperiness + prog * 0.05,
    bossStage: isBoss,
    enemyIds: pickEnemies(lv, z, rnd),
    mutationStage: z.mutationStage,
  };
}

/** ある段階が今アンロックされた見た目基準か(セーブと突き合わせて使う) */
export function mutationStageAtProgress(
  maxUnlocked: number,
  defeatedBosses: number[]
): 0 | 1 | 2 | 3 | 4 {
  if (defeatedBosses.includes(500)) return 4;
  if (defeatedBosses.includes(300)) return 4;
  if (defeatedBosses.includes(150)) return 3;
  if (defeatedBosses.includes(50)) return 2;
  if (maxUnlocked >= 300) return 3;
  if (maxUnlocked >= 150) return 2;
  if (maxUnlocked >= 50) return 1;
  return 0;
}

export const RPG_ZONES = ZONES;
export const BOSS_LEVELS = [50, 150, 300, 500] as const;
export function isBossLevel(level: number): boolean {
  return BOSS_MAP[level] !== undefined;
}
export function bossEnemyIdAt(level: number): string | null {
  return BOSS_MAP[level] ?? null;
}

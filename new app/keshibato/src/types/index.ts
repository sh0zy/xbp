// ケシバト 型定義
export type PlayerId = 1 | 2;

export type EquipmentId =
  | 'none'
  | 'triangle'
  | 'pencil'
  | 'eraserBig'
  | 'ruler'
  | 'sticky'
  | 'clip'
  | 'notebook'
  | 'penCase'
  | 'pushpin'
  | 'scissors'
  | 'eraserCover'
  | 'redPen'
  | 'protractor'
  | 'magnet'
  | 'chalk'
  | 'binder'
  | 'looseLeaf'
  | 'tape';

export type EquipmentCategory = 'attack' | 'defense' | 'trick' | 'support';
export type EquipmentDifficulty = 'easy' | 'normal' | 'hard';

export interface EquipmentData {
  id: EquipmentId;
  name: string;
  shortCatch: string;          // 短いキャッチコピー
  category: EquipmentCategory;
  rarity: 1 | 2 | 3;
  difficulty: EquipmentDifficulty;
  weightModifier: number;      // 質量倍率
  powerModifier: number;       // 発射速度倍率
  stabilityModifier: number;   // 摩擦倍率 (大きいほど止まりにくい)
  trickModifier: number;       // トリッキーさ(表示用 + 将来の物理拡張余地)
  collisionModifier: number;   // 衝突反発倍率
  shapeModifier: number;       // 有効半径倍率
  visualType: string;
  description: string;
  recommendedPlayStyle: string;
  unlockCondition: string;
}

export type StageMode = 'single' | 'versus' | 'rpg';
export type StageCategoryTag =
  | 'beginner' | 'balanced' | 'narrow' | 'obstacle' | 'bumper'
  | 'slippery' | 'hazard' | 'symmetric' | 'chaotic' | 'advanced'
  | 'technical' | 'speed' | 'gimmick';

export type SymmetryType = 'mirror' | 'rotational' | 'asymmetric';

export interface StageData {
  id: string;
  name: string;
  description: string;
  /** 盤面の幅(論理px)。縦は高さ比で決定 */
  width: number;
  height: number;
  /** 障害物 (円) */
  obstacles: Array<{ x: number; y: number; r: number; kind?: 'block' | 'bumper' }>;
  /** 摩擦係数 (0〜1, 大きいほど止まりやすい)。デフォルト 0.985 */
  friction: number;
  theme: 'normal' | 'narrow' | 'obstacle' | 'bumper' | 'slippery';
  unlockCondition: string;
  /** どのモード向け(未指定=汎用). 'rpg'は自動生成の別系統なので基本使わない */
  mode?: StageMode;
  /** UIテーマID (StageUITheme を参照) */
  uiThemeId?: string;
  /** 特徴タグ (選択UIで使用) */
  tags?: StageCategoryTag[];
  /** おすすめCPUレベル (数値1〜7) */
  recommendedCpuLevel?: number;
  /** 左右/回転対称タイプ (2P用) */
  symmetryType?: SymmetryType;
  /** 危険度 0〜4 */
  hazardLevel?: number;
  /** 狭さ 0〜1 */
  narrowness?: number;
  /** 滑りやすさ 0〜1 */
  slipperiness?: number;
}

/** ステージごとにUI全体の雰囲気を切替える最小限のテーマデータ */
export interface StageUITheme {
  id: string;
  /** 画面背景のtailwindグラデ (from/via/to) */
  backgroundClass: string;
  /** パネル(カード)背景色(tailwind or arbitrary) */
  panelClass: string;
  /** 主役アクセント色 (文字) */
  accentTextClass: string;
  /** 主役アクセント色 (背景用) */
  accentBgClass: string;
  /** 文字色 */
  textClass: string;
  /** 枠線 */
  borderClass: string;
  /** ステージ名プレートのクラス */
  platePlateClass: string;
  /** ボード外周フレーム色 (svg fill HEX) */
  boardFrameColor: string;
  /** ボード本体色 (svg fill HEX) */
  boardFieldColor: string;
  /** 中央ライン色 */
  boardLineColor: string;
  /** 追加テクスチャ種別(将来拡張用) */
  textureType?: 'wood' | 'paper' | 'chalk' | 'metal' | 'void' | 'paperRuled' | 'paperRed' | 'floor' | 'night' | 'cracked' | 'abyss' | 'ruined' | 'hell';
  /** 演出強度: 発光レベル */
  glowLevel?: 0 | 1 | 2 | 3;
  /** 危険表示を強めるかどうか */
  dangerTone?: boolean;
  /** 短い説明(一覧用) */
  moodLabel?: string;
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  condition: string;
  reward: string;
}

export interface MissionData {
  id: string;
  title: string;
  description: string;
  goal: number;
}

export type FallEdge = 'top' | 'bottom' | 'left' | 'right';

export interface Piece {
  id: string;
  owner: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  equipments: EquipmentId[];
  alive: boolean;
  /** 落下開始時刻(performance.now()) — 演出の基準 */
  fallStart?: number;
  /** 落下した辺 — 傾き方向の決定に使う */
  fallEdge?: FallEdge;
  /** 最後に装備起因で変化した色コード等 */
  tint?: string;
  /** RPG敵/CPU連勝ボーナス用の追加倍率。省略時は1 */
  extraPowerScale?: number;
  extraStabilityScale?: number;
  extraBounceScale?: number;
  extraMassScale?: number;
  extraRadiusScale?: number;
  /** RPGで敵個体から引いたAI傾向 */
  aiStyle?: EnemyAIStyle;
  /** RPGで敵個体を判別するためのid(表示用) */
  enemyId?: string;
}

export type Phase = 'aim' | 'simulate' | 'resolve' | 'turnChange' | 'end';

export type GameMode = 'solo' | 'duo' | 'practice' | 'challenge' | 'rpg';
/** CPUレベル 7段階 (数字が大きいほど強い) */
export type CpuLevel =
  | 'beginner'
  | 'easy'
  | 'normal'
  | 'hard'
  | 'veryhard'
  | 'extreme'
  | 'nightmare';
/** 旧API互換のエイリアス(内部でCpuLevelと同じ) */
export type Difficulty = CpuLevel;
export type RpgDifficulty = CpuLevel;

export interface LoadoutSlot {
  pieceSlot: 0 | 1 | 2;
  equipments: EquipmentId[]; // 最大2
}

export interface MatchConfig {
  mode: GameMode;
  difficulty: Difficulty;
  stageId: string;
  /** 各プレイヤーのコマ数 */
  pieceCount: number;
  maxTurns: number;
  /** プレイヤー毎の装備セット(コマ数分) */
  loadouts: Record<PlayerId, EquipmentId[][]>;
}

// ===== RPGモード 追加定義 =====
export type EnemyTier = 'early' | 'midEarly' | 'midLate' | 'late' | 'final';
export type EnemyCategory =
  | 'slime'
  | 'beast'
  | 'statue'
  | 'spirit'
  | 'stationery'
  | 'oni'
  | 'demon'
  | 'void'
  | 'boss';
export type EnemyAIStyle = 'aggressive' | 'defensive' | 'trick' | 'balanced' | 'reckless';
export type PhaseStyle = 'cute' | 'uneasy' | 'weird' | 'sinister' | 'apocalyptic';
export type FaceStyle = 'smile' | 'neutral' | 'frown' | 'hollow' | 'mask' | 'void';
export type EyeStyle = 'round' | 'dot' | 'slit' | 'cross' | 'glow' | 'void';
export type SilhouetteType = 'round' | 'wide' | 'tall' | 'angular' | 'organic';

/** 敵キャラデータ(雑魚〜ボス共用) */
export interface EnemyData {
  id: string;
  name: string;
  tier: EnemyTier;
  strengthRank: 1 | 2 | 3 | 4 | 5;
  category: EnemyCategory;
  visualTheme: string;
  phaseStyle: PhaseStyle;
  baseColor: string;
  accentColor: string;
  outlineStyle?: 'soft' | 'sharp' | 'jagged';
  faceStyle?: FaceStyle;
  eyeStyle?: EyeStyle;
  silhouetteType?: SilhouetteType;
  auraLevel: 0 | 1 | 2 | 3 | 4;
  uiFrameType?: 'soft' | 'plain' | 'bold' | 'ominous' | 'hellish';
  iconShape?: 'circle' | 'square' | 'triangle' | 'rounded';
  previewDescription: string;
  battleCardTone?: 'light' | 'normal' | 'dark' | 'eerie' | 'abyss';
  bossWarningStyle?: string;
  spawnCount: 1 | 2 | 3;
  powerScale: number;
  stabilityScale: number;
  speedScale: number;
  aiStyle: EnemyAIStyle;
  preferredEquipment?: EquipmentId[];
  isBoss?: boolean;
  mutationStage: 0 | 1 | 2 | 3 | 4;
}

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'blackgold';

export interface MedalData {
  id: string;
  name: string;
  tier: MedalTier;
  unlockStage: 50 | 150 | 300 | 500;
  description: string;
}

/** RPGステージ(500件テンプレ生成で使う) */
export interface RpgStageData {
  level: number;
  theme: string;
  themeGroup: string;
  width: number;
  height: number;
  friction: number;
  obstacles: Array<{ x: number; y: number; r: number; kind?: 'block' | 'bumper' }>;
  hazardLevel: number;
  narrowness: number;
  slipperiness: number;
  bossStage: boolean;
  enemyIds: string[];
  mutationStage: 0 | 1 | 2 | 3 | 4;
}

export interface RpgSave {
  currentStage: number;
  maxUnlockedStage: number;
  defeatedBosses: number[];
  medals: string[];
  medalUnlockedAt: Record<string, number>;
  bossClearCount: number;
  selectedDifficulty: RpgDifficulty;
  totalWins: number;
  totalLosses: number;
  saveVersion: number;
}

/** 通常モードでもCPU連勝記録を持たせる */
export interface CpuStreakState {
  current: number;
  max: number;
}

/** 装備プリセット(ワンタップで全コマ適用) */
export interface EquipmentPreset {
  id: string;
  name: string;
  equipments: EquipmentId[]; // コマ共通に1〜2個
  createdAt: number;
}

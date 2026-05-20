export type ScreenId =
  | "title"
  | "home"
  | "map"
  | "battle"
  | "equipment"
  | "stats"
  | "settings"
  | "levelSelect"
  | "tutorial";

export type EnemyType = "normal" | "boss";
export type ElementType = "fire" | "water" | "ice" | "thunder" | "heal" | "talk" | "normal";
export type Rank = "S" | "A" | "B" | "C" | "D";
export type EquipmentType = "weapon" | "armor" | "accessory";
export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type HintLevel = "very_high" | "high" | "normal" | "low" | "very_low";

export type DifficultyConfig = {
  level: EnglishLevel;
  label: string;
  description: string;
  target: string;
  motto: string;
  enemyHpMultiplier: number;
  enemyAttackMultiplier: number;
  requiredWordsMultiplier: number;
  scoreStrictness: number;
  expMultiplier: number;
  goldMultiplier: number;
  hintLevel: HintLevel;
};

export interface StageReward {
  exp: number;
  gold: number;
  expression: string;
  equipmentId?: string;
}

export interface Stage {
  id: number;
  name: string;
  enemyId: string;
  theme: string;
  requiredWords: number;
  mission: string;
  hintJa: string;
  recommendedExpressions: string[];
  isBoss: boolean;
  reward: StageReward;
}

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  hp: number;
  attack: number;
  weakness: ElementType;
  emoji: string;
  introMessage: string;
  questions: string[];
  defeatMessage: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  attack: number;
  maxHp: number;
  scoreBonus: number;
  wordBonus: number;
  comboBonus: number;
  unlockStage: number;
}

export interface PlayerEquipment {
  weapon?: string;
  armor?: string;
  accessory?: string;
  owned: string[];
}

export interface GameSettings {
  aiScoring: boolean;
  saveApiKey: boolean;
  model: string;
  apiKey?: string;
  tutorialCompleted: boolean;
  levelSelected: boolean;
}

export interface RecentSentence {
  text: string;
  score: number;
  stageId: number;
  createdAt: string;
}

export interface PlayerData {
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  exp: number;
  gold: number;
  currentStage: number;
  clearedStages: number[];
  bestScore: number;
  maxDamage: number;
  totalSentences: number;
  totalWords: number;
  defeatedEnemies: number;
  comboCount: number;
  bestCombo: number;
  englishLevel: EnglishLevel;
  learnedExpressions: string[];
  titles: string[];
  equipment: PlayerEquipment;
  settings: GameSettings;
  recentSentences: RecentSentence[];
  wordUsage: Record<string, number>;
}

export interface EvaluationRequest {
  userText: string;
  enemyName: string;
  enemyMessage: string;
  stage: number;
  selectedEnglishLevel: EnglishLevel;
  requiredWords: number;
  mission: string;
  battleContext: string;
}

export interface EvaluationResult {
  success: true;
  score: number;
  rank: Rank;
  wordCount: number;
  requiredWords: number;
  lengthClear: boolean;
  damageBonus: number;
  element: ElementType;
  detectedIntent: string;
  goodPoints: string[];
  improvements: string[];
  naturalExpression: string;
  shortExplanationJa: string;
  enemyReply: string;
  battleMessage: string;
  fallback?: boolean;
}

export interface EvaluationFailure {
  success: false;
  fallback: true;
  message: string;
}

export type EvaluationResponse = EvaluationResult | EvaluationFailure;

export interface BattleOutcome {
  didWin: boolean;
  didLose: boolean;
  damage: number;
  enemyAttack: number;
  leveledUp: boolean;
  levelBefore: number;
  levelAfter: number;
}

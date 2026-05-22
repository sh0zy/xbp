export type ChapterId =
  | 'prologue'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter4'
  | 'final';

export type ScreenName =
  | 'title'
  | 'saveSelect'
  | 'game'
  | 'logs'
  | 'inventory'
  | 'settings'
  | 'pause'
  | 'chapterClear'
  | 'ending'
  | 'credits';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Expression =
  | 'neutral'
  | 'worried'
  | 'scared'
  | 'shocked'
  | 'tired'
  | 'silent'
  | 'glitched'
  | 'hidden'
  | 'restored';

export interface Point {
  x: number;
  y: number;
}

export interface AudioSettings {
  enabled: boolean;
  bgmVolume: number;
  seVolume: number;
  noiseEnabled: boolean;
  textSpeed: 'slow' | 'normal' | 'fast';
}

export interface GameLog {
  id: string;
  title: string;
  body: string;
  chapter: ChapterId;
  isImportant: boolean;
  discoveredAt?: string;
  relatedPuzzleId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  chapter: ChapterId;
  icon: 'id' | 'key' | 'flashlight' | 'photo' | 'note' | 'card' | 'ticket' | 'camera';
  isImportant: boolean;
  obtainLocation: string;
}

export type PuzzleKind =
  | 'password'
  | 'code'
  | 'clock'
  | 'sequence'
  | 'breaker'
  | 'photo'
  | 'name'
  | 'choice';

export interface SequenceOption {
  id: string;
  label: string;
}

export interface PuzzleData {
  id: string;
  title: string;
  kind: PuzzleKind;
  chapter: ChapterId;
  prompt: string;
  answer: string | string[];
  prefix?: string;
  placeholder?: string;
  hints: string[];
  options?: SequenceOption[];
  rewardLogs?: string[];
  rewardItems?: string[];
  successDialogueId?: string;
  failureText?: string;
}

export interface DialogueLine {
  speakerId: string;
  expression?: Expression;
  text: string;
  important?: boolean;
  mode?: 'normal' | 'phone' | 'record' | 'anomaly';
}

export interface DialogueData {
  id: string;
  lines: DialogueLine[];
}

export interface InvestigationPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: 'log' | 'item' | 'puzzle' | 'transition' | 'dialogue' | 'chapterEnd' | 'ending';
  radius?: number;
  logId?: string;
  itemId?: string;
  puzzleId?: string;
  dialogueId?: string;
  targetMapId?: string;
  targetPosition?: Point;
  requiredPuzzleIds?: string[];
  requiredItemIds?: string[];
  requiredLogIds?: string[];
  repeatable?: boolean;
  hiddenUntil?: {
    logs?: string[];
    items?: string[];
    puzzles?: string[];
  };
}

export interface NpcData {
  id: string;
  characterId: string;
  x: number;
  y: number;
  dialogueId?: string;
  expression?: Expression;
  appearAfter?: {
    logs?: string[];
    puzzles?: string[];
  };
}

export interface EnemyData {
  id: string;
  characterId: 'absentee';
  x: number;
  y: number;
  behavior: 'glimpse' | 'watch' | 'patrol' | 'chase' | 'memory';
  patrol?: Point[];
  triggerDistance?: number;
}

export interface MapData {
  id: string;
  name: string;
  chapter: ChapterId;
  width: number;
  height: number;
  tiles: string[];
  spawn: Point;
  tint: string;
  objective: string;
  points: InvestigationPoint[];
  npcs?: NpcData[];
  enemy?: EnemyData;
}

export interface ChapterData {
  id: ChapterId;
  title: string;
  subtitle: string;
  maps: string[];
  clearText: string;
}

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  colorPalette: {
    background: string;
    skin?: string;
    hair?: string;
    outfit: string;
    accent: string;
    shadow: string;
  };
  silhouetteType: string;
  faceStyle: string;
  outfit: string;
  expressions: Expression[];
  mapSprite: string;
  portrait: string;
  horrorVariants: string[];
  chapterAppearances: Partial<Record<ChapterId, string>>;
}

export interface EndingData {
  id: 'endingA' | 'endingB' | 'endingC';
  title: string;
  subtitle: string;
  body: string[];
}

export interface RuntimeNotification {
  id: string;
  type: 'log' | 'item' | 'save' | 'warning' | 'system';
  text: string;
}

export interface SaveSlotSummary {
  slot: number;
  isEmpty: boolean;
  chapter?: ChapterId;
  mapName?: string;
  updatedAt?: string;
  playTimeSeconds?: number;
  logCount?: number;
  importantCount?: number;
  label?: string;
  clearedEndings?: string[];
}

export interface SaveData {
  version: number;
  slot: number;
  createdAt: string;
  updatedAt: string;
  playTimeSeconds: number;
  currentChapter: ChapterId;
  currentMapId: string;
  playerPosition: Point;
  direction: Direction;
  collectedLogs: string[];
  logDiscoveredAt: Record<string, string>;
  readLogs: string[];
  inventory: string[];
  itemObtainedAt: Record<string, string>;
  solvedPuzzles: string[];
  choices: Record<string, string>;
  endingFlags: Record<string, boolean>;
  clearedEndings: string[];
  hintLevels: Record<string, number>;
  discoveredDialogues: string[];
  checkpoint: {
    mapId: string;
    position: Point;
  };
  audioSettings: AudioSettings;
  slotLabel?: string;
}

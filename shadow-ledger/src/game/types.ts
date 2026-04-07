export type GamePhase =
  | "title"
  | "exploration"
  | "dialogue"
  | "menu"
  | "inventory"
  | "journal"
  | "ending"
  | "gameover";

export type ActivePanel = "menu" | "inventory" | "journal" | null;

export type MapId =
  | "foyer"
  | "corridor"
  | "archive"
  | "ward"
  | "stairwell"
  | "basement";

export type Direction = "up" | "down" | "left" | "right";

export type Position = {
  x: number;
  y: number;
};

export type ItemId =
  | "visitor-pass"
  | "ward-key"
  | "prayer-slip"
  | "rosary-beads"
  | "patient-tag"
  | "ledger-fragment";

export type Item = {
  id: ItemId;
  name: string;
  description: string;
  detail: string;
  tag: "key" | "tool" | "ritual" | "record";
};

export type InventoryState = {
  itemIds: ItemId[];
  highlightedItemId: ItemId | null;
};

export type JournalId =
  | "voicemail-transcript"
  | "patient-list"
  | "accident-report"
  | "mio-chart"
  | "nurse-confession"
  | "blood-ledger";

export type JournalEntry = {
  id: JournalId;
  title: string;
  category: "memo" | "diary" | "report" | "recording" | "list" | "chart";
  excerpt: string;
  pages: string[];
};

export type EventFlag =
  | "introSeen"
  | "foyerPhoneSeen"
  | "visitorPassTaken"
  | "corridorEntered"
  | "archiveEntered"
  | "archiveCodeSolved"
  | "patientListRead"
  | "accidentReportRead"
  | "chartRead"
  | "wardDoorUnlocked"
  | "wardEntered"
  | "wardCabinetSolved"
  | "patientTagTaken"
  | "ledgerFragmentTaken"
  | "confessionRead"
  | "prayerSlipTaken"
  | "rosaryTaken"
  | "chaseStarted"
  | "chaseCompleted"
  | "hidFromNurse"
  | "stairwellEntered"
  | "basementUnlocked"
  | "basementEntered"
  | "payphoneChanged"
  | "bloodLedgerRead"
  | "endingRelease"
  | "endingInheritance"
  | "endingSilence";

export type EndingType = "release" | "inheritance" | "silence";

export type MapTransition = {
  mapId: MapId;
  position: Position;
  facing: Direction;
};

export type DialogueChoice = {
  label: string;
  nextId?: string;
  setFlags?: EventFlag[];
  clearFlags?: EventFlag[];
  grantItemIds?: ItemId[];
  grantJournalIds?: JournalId[];
  transitionToMap?: MapTransition;
  ending?: EndingType;
  completeChase?: boolean;
  statusText?: string;
};

export type DialogueEntry = {
  id: string;
  speaker: string;
  text: string;
  tone?: "calm" | "warning" | "dread";
  nextId?: string;
  choices?: DialogueChoice[];
  setFlags?: EventFlag[];
  clearFlags?: EventFlag[];
  grantItemIds?: ItemId[];
  grantJournalIds?: JournalId[];
  transitionToMap?: MapTransition;
  startChase?: ChaseState["id"];
  completeChase?: boolean;
  ending?: EndingType;
  gameOverText?: string;
  statusText?: string;
};

export type MapObjectKind = "inspect" | "pickup" | "door" | "hide" | "seal";

export type MapObject = {
  id: string;
  mapId: MapId;
  position: Position;
  label: string;
  kind: MapObjectKind;
  actionLabel: string;
  description: string;
  interactFrom: "adjacent" | "same";
  blocksMovement?: boolean;
  requiredFlags?: EventFlag[];
  hiddenUntilFlags?: EventFlag[];
  disabledWhenFlags?: EventFlag[];
  glow?: "none" | "cold" | "danger" | "item";
};

export type MapDefinition = {
  id: MapId;
  name: string;
  subtitle: string;
  ambient: string;
  grid: string[];
  spawn: Position;
  objects: MapObject[];
};

export type SceneEvent = {
  id: string;
  trigger: "enter" | "interact";
  mapId: MapId;
  objectId?: string;
  requiredFlags?: EventFlag[];
  excludedFlags?: EventFlag[];
  dialogueId: string;
};

export type ChaseState = {
  id: "corridor-hunt";
  active: boolean;
  pursuerDistance: number;
  maxDistance: number;
  safeObjectId: string;
  completed: boolean;
};

export type PlayerState = {
  mapId: MapId;
  position: Position;
  facing: Direction;
  steps: number;
  hidden: boolean;
  lastSafePosition: Position;
};

export type SaveData = {
  version: number;
  phase: "exploration" | "dialogue";
  player: PlayerState;
  inventory: InventoryState;
  discoveredJournalIds: JournalId[];
  readJournalIds: JournalId[];
  flags: EventFlag[];
  activeDialogueId: string | null;
  dialogueHistory: string[];
  chase: ChaseState;
  playTimeSeconds: number;
  lastStatusText: string;
  seenEndings: EndingType[];
  savedAt: string;
};

export type GameState = {
  phase: GamePhase;
  activePanel: ActivePanel;
  player: PlayerState;
  inventory: InventoryState;
  discoveredJournalIds: JournalId[];
  readJournalIds: JournalId[];
  selectedJournalId: JournalId | null;
  flags: EventFlag[];
  activeDialogueId: string | null;
  dialogueHistory: string[];
  chase: ChaseState;
  playTimeSeconds: number;
  lastStatusText: string;
  currentEnding: EndingType | null;
  seenEndings: EndingType[];
  gameOverText: string | null;
};

import {
  ALL_ENDINGS,
  ALL_EVENT_FLAGS,
  ALL_ITEM_IDS,
  ALL_JOURNAL_IDS,
  APP_NAME,
  CHASE_MAX_DISTANCE,
  ITEM_FLAG_MAP,
  SAVE_KEY,
  SAVE_VERSION,
  VIEWPORT_COLUMNS,
  VIEWPORT_ROWS
} from "./constants";
import {
  DEFAULT_CHASE_STATE,
  DIALOGUES,
  ENDING_SUMMARIES,
  ITEMS,
  JOURNALS,
  MAPS,
  SCENE_EVENTS
} from "./content";
import type {
  DialogueChoice,
  DialogueEntry,
  Direction,
  EndingType,
  EventFlag,
  GameState,
  ItemId,
  JournalId,
  MapDefinition,
  MapObject,
  PlayerState,
  Position,
  SaveData
} from "./types";

export type GameAction =
  | { type: "NEW_GAME" }
  | { type: "LOAD_SAVE"; save: SaveData }
  | { type: "RETURN_TITLE" }
  | { type: "MOVE"; direction: Direction }
  | { type: "INTERACT" }
  | { type: "ADVANCE_DIALOGUE" }
  | { type: "CHOOSE_DIALOGUE"; index: number }
  | { type: "OPEN_MENU" }
  | { type: "OPEN_PANEL"; panel: "inventory" | "journal" }
  | { type: "CLOSE_PANEL" }
  | { type: "SELECT_ITEM"; itemId: ItemId }
  | { type: "SELECT_JOURNAL"; journalId: JournalId }
  | { type: "TICK" }
  | { type: "REPORT_SAVE"; message: string };

export type ViewportCell = {
  key: string;
  kind: "void" | "wall" | "floor";
  object: MapObject | null;
  isPlayer: boolean;
  distance: number;
};

const MAP_IDS = Object.keys(MAPS) as Array<keyof typeof MAPS>;
const DIALOGUE_IDS = Object.keys(DIALOGUES);
const ITEM_SET = new Set(ALL_ITEM_IDS);
const JOURNAL_SET = new Set(ALL_JOURNAL_IDS);
const FLAG_SET = new Set(ALL_EVENT_FLAGS);
const ENDING_SET = new Set(ALL_ENDINGS);
const MAP_SET = new Set(MAP_IDS);
const DIALOGUE_SET = new Set(DIALOGUE_IDS);

const makePlayer = (): PlayerState => ({
  mapId: "foyer",
  position: { ...MAPS.foyer.spawn },
  facing: "up",
  steps: 0,
  hidden: false,
  lastSafePosition: { ...MAPS.foyer.spawn }
});

const makeBaseState = (seenEndings: EndingType[]): GameState => ({
  phase: "title",
  activePanel: null,
  player: makePlayer(),
  inventory: {
    itemIds: [],
    highlightedItemId: null
  },
  discoveredJournalIds: [],
  readJournalIds: [],
  selectedJournalId: null,
  flags: [],
  activeDialogueId: null,
  dialogueHistory: [],
  chase: { ...DEFAULT_CHASE_STATE },
  playTimeSeconds: 0,
  lastStatusText: `${APP_NAME} は静かに閉じている。`,
  currentEnding: null,
  seenEndings,
  gameOverText: null
});

export const createTitleState = (storedSave: SaveData | null): GameState => {
  const seenEndings = storedSave?.seenEndings ?? [];
  return {
    ...makeBaseState(seenEndings),
    phase: "title",
    lastStatusText: storedSave
      ? "前回の記録が残っている。"
      : "新しい記録帳はまだ空白だ。"
  };
};

export const createNewGameState = (seenEndings: EndingType[]): GameState => ({
  ...makeBaseState(seenEndings),
  phase: "dialogue",
  activeDialogueId: "intro-1",
  dialogueHistory: ["intro-1"],
  lastStatusText: MAPS.foyer.ambient
});

export const hydrateGameState = (save: SaveData): GameState => ({
  ...makeBaseState(save.seenEndings),
  phase: save.activeDialogueId ? "dialogue" : "exploration",
  player: save.player,
  inventory: save.inventory,
  discoveredJournalIds: save.discoveredJournalIds,
  readJournalIds: save.readJournalIds,
  selectedJournalId: save.discoveredJournalIds[0] ?? null,
  flags: save.flags,
  activeDialogueId: save.activeDialogueId,
  dialogueHistory: save.dialogueHistory,
  chase: save.chase,
  playTimeSeconds: save.playTimeSeconds,
  lastStatusText: save.lastStatusText,
  seenEndings: save.seenEndings
});

const cloneState = (state: GameState): GameState => ({
  ...state,
  player: {
    ...state.player,
    position: { ...state.player.position },
    lastSafePosition: { ...state.player.lastSafePosition }
  },
  inventory: {
    ...state.inventory,
    itemIds: [...state.inventory.itemIds]
  },
  discoveredJournalIds: [...state.discoveredJournalIds],
  readJournalIds: [...state.readJournalIds],
  flags: [...state.flags],
  dialogueHistory: [...state.dialogueHistory],
  chase: { ...state.chase }
});

const hasFlag = (state: GameState, flag: EventFlag) => state.flags.includes(flag);

const addFlag = (state: GameState, flag: EventFlag) => {
  if (!state.flags.includes(flag)) {
    state.flags.push(flag);
  }
};

const removeFlag = (state: GameState, flag: EventFlag) => {
  state.flags = state.flags.filter((currentFlag) => currentFlag !== flag);
};

const appendDialogueHistory = (state: GameState, dialogueId: string) => {
  if (state.dialogueHistory[state.dialogueHistory.length - 1] !== dialogueId) {
    state.dialogueHistory.push(dialogueId);
  }
};

const addItem = (state: GameState, itemId: ItemId) => {
  if (!state.inventory.itemIds.includes(itemId)) {
    state.inventory.itemIds.push(itemId);
  }
  if (!state.inventory.highlightedItemId) {
    state.inventory.highlightedItemId = itemId;
  }
  const mappedFlag = ITEM_FLAG_MAP[itemId];
  if (mappedFlag) {
    addFlag(state, mappedFlag);
  }
};

const addJournal = (state: GameState, journalId: JournalId) => {
  if (!state.discoveredJournalIds.includes(journalId)) {
    state.discoveredJournalIds.push(journalId);
  }
  if (!state.selectedJournalId) {
    state.selectedJournalId = journalId;
  }
};

const markJournalRead = (state: GameState, journalId: JournalId) => {
  if (!state.readJournalIds.includes(journalId)) {
    state.readJournalIds.push(journalId);
  }
};

const applyDialoguePayload = (
  sourceState: GameState,
  payload: Pick<
    DialogueEntry | DialogueChoice,
    | "setFlags"
    | "clearFlags"
    | "grantItemIds"
    | "grantJournalIds"
    | "transitionToMap"
    | "statusText"
    | "ending"
    | "completeChase"
  > & {
    startChase?: DialogueEntry["startChase"];
    gameOverText?: DialogueEntry["gameOverText"];
  }
): GameState => {
  const state = cloneState(sourceState);

  payload.clearFlags?.forEach((flag) => removeFlag(state, flag));
  payload.setFlags?.forEach((flag) => addFlag(state, flag));
  payload.grantItemIds?.forEach((itemId) => addItem(state, itemId));
  payload.grantJournalIds?.forEach((journalId) => addJournal(state, journalId));

  if (payload.statusText) {
    state.lastStatusText = payload.statusText;
  }

  if (payload.startChase) {
    state.chase = {
      id: payload.startChase,
      active: true,
      pursuerDistance: 0,
      maxDistance: CHASE_MAX_DISTANCE,
      safeObjectId: "ward-closet",
      completed: false
    };
    state.player.hidden = false;
  }

  if (payload.completeChase) {
    state.chase = {
      ...state.chase,
      active: false,
      completed: true
    };
    state.player.hidden = true;
  }

  if (payload.transitionToMap) {
    state.player.mapId = payload.transitionToMap.mapId;
    state.player.position = { ...payload.transitionToMap.position };
    state.player.facing = payload.transitionToMap.facing;
    state.player.hidden = false;
    if (!state.chase.active) {
      state.player.lastSafePosition = { ...payload.transitionToMap.position };
    }
    state.lastStatusText = getAreaText(state);
  }

  if (payload.gameOverText) {
    state.phase = "gameover";
    state.gameOverText = payload.gameOverText;
    state.activeDialogueId = null;
    state.activePanel = null;
    state.currentEnding = null;
    return state;
  }

  if (payload.ending) {
    const endingFlag =
      payload.ending === "release"
        ? "endingRelease"
        : payload.ending === "inheritance"
          ? "endingInheritance"
          : "endingSilence";

    addFlag(state, endingFlag);
    if (!state.seenEndings.includes(payload.ending)) {
      state.seenEndings.push(payload.ending);
    }
    state.phase = "ending";
    state.currentEnding = payload.ending;
    state.activeDialogueId = null;
    state.activePanel = null;
    state.gameOverText = null;
  }

  return state;
};

const matchesFlagConditions = (
  state: GameState,
  requiredFlags?: EventFlag[],
  excludedFlags?: EventFlag[]
) => {
  const hasRequired = requiredFlags?.every((flag) => hasFlag(state, flag)) ?? true;
  const missesExcluded =
    excludedFlags?.every((flag) => !hasFlag(state, flag)) ?? true;
  return hasRequired && missesExcluded;
};

const getMapById = (mapId: PlayerState["mapId"]): MapDefinition => MAPS[mapId];

const isObjectVisible = (state: GameState, object: MapObject) => {
  const meetsRequired =
    object.requiredFlags?.every((flag) => hasFlag(state, flag)) ?? true;
  const meetsHidden =
    object.hiddenUntilFlags?.every((flag) => hasFlag(state, flag)) ?? true;
  const isDisabled =
    object.disabledWhenFlags?.some((flag) => hasFlag(state, flag)) ?? false;

  return meetsRequired && meetsHidden && !isDisabled;
};

export const getVisibleObjects = (state: GameState): MapObject[] =>
  getMapById(state.player.mapId).objects.filter((object) => isObjectVisible(state, object));

const positionsMatch = (first: Position, second: Position) =>
  first.x === second.x && first.y === second.y;

const getFacingOffset = (direction: Direction) => {
  switch (direction) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
};

const getNextPosition = (position: Position, direction: Direction): Position => {
  const offset = getFacingOffset(direction);
  return {
    x: position.x + offset.x,
    y: position.y + offset.y
  };
};

const manhattanDistance = (first: Position, second: Position) =>
  Math.abs(first.x - second.x) + Math.abs(first.y - second.y);

export const getActionTarget = (state: GameState): MapObject | null => {
  const objects = getVisibleObjects(state);
  const sameTileObject = objects.find(
    (object) =>
      object.interactFrom === "same" && positionsMatch(object.position, state.player.position)
  );
  if (sameTileObject) {
    return sameTileObject;
  }

  const facingPosition = getNextPosition(state.player.position, state.player.facing);
  const facingObject = objects.find(
    (object) =>
      object.interactFrom === "adjacent" && positionsMatch(object.position, facingPosition)
  );
  if (facingObject) {
    return facingObject;
  }

  return (
    objects.find(
      (object) =>
        object.interactFrom === "adjacent" &&
        manhattanDistance(object.position, state.player.position) === 1
    ) ?? null
  );
};

const getInteractEvent = (state: GameState, object: MapObject) =>
  SCENE_EVENTS.find(
    (event) =>
      event.trigger === "interact" &&
      event.mapId === object.mapId &&
      event.objectId === object.id &&
      matchesFlagConditions(state, event.requiredFlags, event.excludedFlags)
  );

const beginDialogue = (state: GameState, dialogueId: string): GameState => {
  const nextState = cloneState(state);
  nextState.phase = "dialogue";
  nextState.activeDialogueId = dialogueId;
  nextState.activePanel = null;
  appendDialogueHistory(nextState, dialogueId);
  return nextState;
};

const triggerEnterEventIfNeeded = (state: GameState): GameState => {
  if (state.phase !== "exploration" || state.activePanel || state.chase.active) {
    return state;
  }

  const nextEvent = SCENE_EVENTS.find(
    (event) =>
      event.trigger === "enter" &&
      event.mapId === state.player.mapId &&
      matchesFlagConditions(state, event.requiredFlags, event.excludedFlags)
  );

  return nextEvent ? beginDialogue(state, nextEvent.dialogueId) : state;
};

const finishDialogue = (state: GameState): GameState => {
  const nextState = cloneState(state);
  nextState.phase = "exploration";
  nextState.activeDialogueId = null;
  nextState.activePanel = null;
  nextState.player.hidden = false;
  return triggerEnterEventIfNeeded(nextState);
};

const advanceDialogue = (sourceState: GameState): GameState => {
  if (!sourceState.activeDialogueId) {
    return sourceState;
  }

  const entry = DIALOGUES[sourceState.activeDialogueId];
  if (!entry || entry.choices) {
    return sourceState;
  }

  const effectedState = applyDialoguePayload(sourceState, entry);
  if (effectedState.phase === "ending" || effectedState.phase === "gameover") {
    return effectedState;
  }

  if (entry.nextId) {
    return beginDialogue(
      {
        ...effectedState,
        phase: "dialogue",
        activeDialogueId: null
      },
      entry.nextId
    );
  }

  return finishDialogue({
    ...effectedState,
    activeDialogueId: null
  });
};

const chooseDialogue = (sourceState: GameState, choiceIndex: number): GameState => {
  if (!sourceState.activeDialogueId) {
    return sourceState;
  }

  const entry = DIALOGUES[sourceState.activeDialogueId];
  const choice = entry?.choices?.[choiceIndex];
  if (!entry || !choice) {
    return sourceState;
  }

  const effectedState = applyDialoguePayload(sourceState, choice);
  if (effectedState.phase === "ending" || effectedState.phase === "gameover") {
    return effectedState;
  }

  if (choice.nextId) {
    return beginDialogue(
      {
        ...effectedState,
        phase: "dialogue",
        activeDialogueId: null
      },
      choice.nextId
    );
  }

  return finishDialogue({
    ...effectedState,
    activeDialogueId: null
  });
};

const canMoveTo = (map: MapDefinition, position: Position) => {
  if (position.y < 0 || position.y >= map.grid.length) {
    return false;
  }
  if (position.x < 0 || position.x >= map.grid[position.y].length) {
    return false;
  }

  return map.grid[position.y][position.x] === ".";
};

const movePlayer = (sourceState: GameState, direction: Direction): GameState => {
  if (sourceState.phase !== "exploration" || sourceState.activePanel) {
    return sourceState;
  }

  const state = cloneState(sourceState);
  state.player.facing = direction;
  const map = getMapById(state.player.mapId);
  const nextPosition = getNextPosition(state.player.position, direction);

  if (!canMoveTo(map, nextPosition)) {
    state.lastStatusText = "壁の向こうだけが、近すぎる。";
    return state;
  }

  state.player.position = nextPosition;
  state.player.steps += 1;
  if (!state.chase.active) {
    state.player.lastSafePosition = { ...nextPosition };
    state.lastStatusText = getAreaText(state);
    return state;
  }

  state.chase.pursuerDistance += 1;
  state.lastStatusText = "後ろの靴音が、まだ一歩ぶん近い。";
  if (state.chase.pursuerDistance >= state.chase.maxDistance) {
    state.phase = "gameover";
    state.activePanel = null;
    state.activeDialogueId = null;
    state.currentEnding = null;
    state.gameOverText = "靴音は最後の一歩で、あなたの名前を思い出した。";
    return state;
  }

  return state;
};

const interact = (sourceState: GameState): GameState => {
  if (sourceState.activePanel) {
    return sourceState;
  }

  if (sourceState.phase === "dialogue") {
    return advanceDialogue(sourceState);
  }

  if (sourceState.phase !== "exploration") {
    return sourceState;
  }

  const target = getActionTarget(sourceState);
  if (!target) {
    return {
      ...sourceState,
      lastStatusText: sourceState.chase.active
        ? "立ち止まる暇はない。"
        : "返ってくるのは、自分の呼吸だけ。"
    };
  }

  const event = getInteractEvent(sourceState, target);
  if (!event) {
    return {
      ...sourceState,
      lastStatusText: target.description
    };
  }

  return beginDialogue(sourceState, event.dialogueId);
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "NEW_GAME":
      return createNewGameState(state.seenEndings);
    case "LOAD_SAVE":
      return hydrateGameState(action.save);
    case "RETURN_TITLE":
      return createTitleState({
        ...toSaveData({
          ...state,
          phase: "exploration",
          activePanel: null,
          activeDialogueId: null,
          currentEnding: null,
          gameOverText: null
        }),
        seenEndings: state.seenEndings
      });
    case "MOVE":
      return movePlayer(state, action.direction);
    case "INTERACT":
      return interact(state);
    case "ADVANCE_DIALOGUE":
      return advanceDialogue(state);
    case "CHOOSE_DIALOGUE":
      return chooseDialogue(state, action.index);
    case "OPEN_MENU":
      if (state.phase !== "exploration" || state.chase.active) {
        return state;
      }
      return { ...state, activePanel: "menu" };
    case "OPEN_PANEL":
      if (state.chase.active || state.phase !== "exploration") {
        return state;
      }
      if (action.panel === "inventory" && state.inventory.itemIds.length === 0) {
        return state;
      }
      if (action.panel === "journal" && state.discoveredJournalIds.length === 0) {
        return state;
      }
      return {
        ...state,
        activePanel: action.panel,
        inventory: {
          ...state.inventory,
          highlightedItemId:
            action.panel === "inventory"
              ? (state.inventory.highlightedItemId ?? state.inventory.itemIds[0] ?? null)
              : state.inventory.highlightedItemId
        },
        selectedJournalId:
          action.panel === "journal"
            ? (state.selectedJournalId ?? state.discoveredJournalIds[0] ?? null)
            : state.selectedJournalId,
        readJournalIds:
          action.panel === "journal" && state.discoveredJournalIds[0]
            ? Array.from(new Set([...state.readJournalIds, state.discoveredJournalIds[0]]))
            : state.readJournalIds
      };
    case "CLOSE_PANEL":
      return { ...state, activePanel: null };
    case "SELECT_ITEM":
      return {
        ...state,
        inventory: {
          ...state.inventory,
          highlightedItemId: action.itemId
        }
      };
    case "SELECT_JOURNAL": {
      const nextState = cloneState(state);
      nextState.selectedJournalId = action.journalId;
      markJournalRead(nextState, action.journalId);
      return nextState;
    }
    case "TICK":
      if (state.phase === "title" || state.phase === "ending" || state.phase === "gameover") {
        return state;
      }
      return {
        ...state,
        playTimeSeconds: state.playTimeSeconds + 1
      };
    case "REPORT_SAVE":
      return {
        ...state,
        lastStatusText: action.message
      };
  }
};

export const getCurrentDialogue = (state: GameState) =>
  state.activeDialogueId ? DIALOGUES[state.activeDialogueId] : null;

export const getCurrentMap = (state: GameState) => getMapById(state.player.mapId);

export const getActionLabel = (state: GameState) => {
  if (state.activePanel) {
    return "閉じる";
  }
  if (state.phase === "dialogue") {
    const dialogue = getCurrentDialogue(state);
    return dialogue?.choices ? "選ぶ" : "次へ";
  }
  if (state.phase === "gameover") {
    return "続ける";
  }
  if (state.phase === "ending") {
    return "戻る";
  }
  return getActionTarget(state)?.actionLabel ?? "調べる";
};

export const getAreaText = (state: GameState) => {
  switch (state.player.mapId) {
    case "foyer":
      if (hasFlag(state, "chaseCompleted")) {
        return "さっきまで安全だった玄関にも、水の線がまっすぐ伸びている。";
      }
      if (hasFlag(state, "chartRead")) {
        return "公衆電話が鳴りそうで鳴らない。その間だけ、玄関が狭い。";
      }
      return MAPS.foyer.ambient;
    case "corridor":
      if (state.chase.active) {
        return "無音。自分の呼吸と、後ろの靴音だけが大きすぎる。";
      }
      if (hasFlag(state, "chartRead") && !hasFlag(state, "chaseCompleted")) {
        return "壁に赤い手形が増え、灯りが届く範囲だけが急に短く見える。";
      }
      return MAPS.corridor.ambient;
    case "archive":
      return hasFlag(state, "chartRead")
        ? "紙の束が、あなたの名前だけ先に知っていた。"
        : MAPS.archive.ambient;
    case "ward":
      return hasFlag(state, "chaseCompleted")
        ? "布の奥は静かだが、もう二度と完全な安全ではない。"
        : MAPS.ward.ambient;
    case "stairwell":
      return MAPS.stairwell.ambient;
    case "basement":
      return hasFlag(state, "bloodLedgerRead")
        ? "最後の空欄が、読まれたあとみたいにあなたを見返している。"
        : MAPS.basement.ambient;
  }
};

export const buildViewport = (state: GameState): ViewportCell[] => {
  const map = getCurrentMap(state);
  const objects = getVisibleObjects(state);
  const halfWidth = Math.floor(VIEWPORT_COLUMNS / 2);
  const halfHeight = Math.floor(VIEWPORT_ROWS / 2);
  const cells: ViewportCell[] = [];

  for (let row = -halfHeight; row <= halfHeight; row += 1) {
    for (let column = -halfWidth; column <= halfWidth; column += 1) {
      const worldX = state.player.position.x + column;
      const worldY = state.player.position.y + row;
      const inBounds =
        worldY >= 0 &&
        worldY < map.grid.length &&
        worldX >= 0 &&
        worldX < map.grid[worldY].length;
      const tile = inBounds ? map.grid[worldY][worldX] : " ";
      const object =
        objects.find((currentObject) => currentObject.position.x === worldX && currentObject.position.y === worldY) ??
        null;

      cells.push({
        key: `${worldX}-${worldY}`,
        kind: !inBounds ? "void" : tile === "#" ? "wall" : "floor",
        object,
        isPlayer: worldX === state.player.position.x && worldY === state.player.position.y,
        distance: Math.max(Math.abs(column), Math.abs(row))
      });
    }
  }

  return cells;
};

export const getInventoryItems = (state: GameState) =>
  state.inventory.itemIds.map((itemId) => ITEMS[itemId]);

export const getJournalEntries = (state: GameState) =>
  state.discoveredJournalIds.map((journalId) => JOURNALS[journalId]);

export const getEndingSummary = (ending: EndingType | null) =>
  ending ? ENDING_SUMMARIES[ending] : null;

export const formatPlayTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const sanitizePosition = (mapId: PlayerState["mapId"], position: Position) => {
  const map = MAPS[mapId];
  if (!map) {
    return { ...MAPS.foyer.spawn };
  }
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.y >= map.grid.length ||
    position.x >= map.grid[position.y].length ||
    map.grid[position.y][position.x] !== "."
  ) {
    return { ...map.spawn };
  }
  return {
    x: position.x,
    y: position.y
  };
};

const sanitizeSaveData = (data: unknown): SaveData | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as Partial<SaveData>;
  if (candidate.version !== SAVE_VERSION) {
    return null;
  }

  const mapId =
    typeof candidate.player?.mapId === "string" && MAP_SET.has(candidate.player.mapId)
      ? candidate.player.mapId
      : "foyer";
  const position = sanitizePosition(
    mapId,
    candidate.player?.position ?? { x: MAPS.foyer.spawn.x, y: MAPS.foyer.spawn.y }
  );
  const lastSafePosition = sanitizePosition(
    mapId,
    candidate.player?.lastSafePosition ?? position
  );

  const inventoryItemIds = (candidate.inventory?.itemIds ?? []).filter(
    (itemId): itemId is ItemId => typeof itemId === "string" && ITEM_SET.has(itemId as ItemId)
  );
  const discoveredJournalIds = (candidate.discoveredJournalIds ?? []).filter(
    (journalId): journalId is JournalId =>
      typeof journalId === "string" && JOURNAL_SET.has(journalId as JournalId)
  );
  const readJournalIds = (candidate.readJournalIds ?? []).filter(
    (journalId): journalId is JournalId =>
      typeof journalId === "string" && JOURNAL_SET.has(journalId as JournalId)
  );
  const flags = (candidate.flags ?? []).filter(
    (flag): flag is EventFlag => typeof flag === "string" && FLAG_SET.has(flag as EventFlag)
  );
  const seenEndings = (candidate.seenEndings ?? []).filter(
    (ending): ending is EndingType =>
      typeof ending === "string" && ENDING_SET.has(ending as EndingType)
  );
  const activeDialogueId =
    typeof candidate.activeDialogueId === "string" && DIALOGUE_SET.has(candidate.activeDialogueId)
      ? candidate.activeDialogueId
      : null;
  const dialogueHistory = (candidate.dialogueHistory ?? []).filter(
    (dialogueId): dialogueId is string =>
      typeof dialogueId === "string" && DIALOGUE_SET.has(dialogueId)
  );
  const highlightedItemId =
    typeof candidate.inventory?.highlightedItemId === "string" &&
    ITEM_SET.has(candidate.inventory.highlightedItemId)
      ? candidate.inventory.highlightedItemId
      : inventoryItemIds[0] ?? null;

  return {
    version: SAVE_VERSION,
    phase: candidate.phase === "dialogue" ? "dialogue" : "exploration",
    player: {
      mapId,
      position,
      facing:
        candidate.player?.facing === "up" ||
        candidate.player?.facing === "down" ||
        candidate.player?.facing === "left" ||
        candidate.player?.facing === "right"
          ? candidate.player.facing
          : "up",
      steps:
        typeof candidate.player?.steps === "number" && Number.isFinite(candidate.player.steps)
          ? candidate.player.steps
          : 0,
      hidden: Boolean(candidate.player?.hidden),
      lastSafePosition
    },
    inventory: {
      itemIds: inventoryItemIds,
      highlightedItemId
    },
    discoveredJournalIds,
    readJournalIds,
    flags,
    activeDialogueId,
    dialogueHistory,
    chase: {
      id: "corridor-hunt",
      active: Boolean(candidate.chase?.active),
      pursuerDistance:
        typeof candidate.chase?.pursuerDistance === "number" &&
        Number.isFinite(candidate.chase.pursuerDistance)
          ? candidate.chase.pursuerDistance
          : 0,
      maxDistance:
        typeof candidate.chase?.maxDistance === "number" &&
        Number.isFinite(candidate.chase.maxDistance)
          ? candidate.chase.maxDistance
          : CHASE_MAX_DISTANCE,
      safeObjectId:
        typeof candidate.chase?.safeObjectId === "string"
          ? candidate.chase.safeObjectId
          : "ward-closet",
      completed: Boolean(candidate.chase?.completed)
    },
    playTimeSeconds:
      typeof candidate.playTimeSeconds === "number" &&
      Number.isFinite(candidate.playTimeSeconds)
        ? candidate.playTimeSeconds
        : 0,
    lastStatusText:
      typeof candidate.lastStatusText === "string"
        ? candidate.lastStatusText
        : MAPS.foyer.ambient,
    seenEndings,
    savedAt:
      typeof candidate.savedAt === "string"
        ? candidate.savedAt
        : new Date(0).toISOString()
  };
};

export const loadSaveData = (): SaveData | null => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return sanitizeSaveData(parsed);
  } catch {
    return null;
  }
};

export const toSaveData = (state: GameState): SaveData => ({
  version: SAVE_VERSION,
  phase: state.phase === "dialogue" ? "dialogue" : "exploration",
  player: state.player,
  inventory: state.inventory,
  discoveredJournalIds: state.discoveredJournalIds,
  readJournalIds: state.readJournalIds,
  flags: state.flags,
  activeDialogueId: state.activeDialogueId,
  dialogueHistory: state.dialogueHistory,
  chase: state.chase,
  playTimeSeconds: state.playTimeSeconds,
  lastStatusText: state.lastStatusText,
  seenEndings: state.seenEndings,
  savedAt: new Date().toISOString()
});

export const persistSaveData = (saveData: SaveData) => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return;
  }

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
};

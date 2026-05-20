import type { EnglishLevel, GameSettings, PlayerData } from "../types";

const STORAGE_KEY = "englishQuestRpg.player.v1";

export const defaultSettings: GameSettings = {
  aiScoring: false,
  saveApiKey: false,
  model: "gpt-5.4",
  tutorialCompleted: false,
  levelSelected: false,
};

const isEnglishLevel = (value: unknown): value is EnglishLevel => value === "A1" || value === "A2" || value === "B1" || value === "B2" || value === "C1";

export const createDefaultPlayer = (): PlayerData => ({
  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 30,
  maxMp: 30,
  attack: 16,
  defense: 4,
  exp: 0,
  gold: 0,
  currentStage: 1,
  clearedStages: [],
  bestScore: 0,
  maxDamage: 0,
  totalSentences: 0,
  totalWords: 0,
  defeatedEnemies: 0,
  comboCount: 0,
  bestCombo: 0,
  englishLevel: "A1",
  learnedExpressions: [],
  titles: [],
  equipment: {
    weapon: "wooden-pencil",
    armor: undefined,
    accessory: undefined,
    owned: ["wooden-pencil"],
  },
  settings: { ...defaultSettings },
  recentSentences: [],
  wordUsage: {},
});

const sanitizeForStorage = (player: PlayerData): PlayerData => {
  const copy: PlayerData = JSON.parse(JSON.stringify(player));
  if (!copy.settings.saveApiKey) {
    delete copy.settings.apiKey;
  }
  return copy;
};

const mergePlayer = (data: Partial<PlayerData>): PlayerData => {
  const defaults = createDefaultPlayer();
  const settings = { ...defaultSettings, ...(data.settings ?? {}) };
  if (settings.model === "gpt-5.5" || settings.model.toLowerCase() === "gpt5.4") {
    settings.model = "gpt-5.4";
  }
  if (!settings.saveApiKey) {
    delete settings.apiKey;
  }
  const englishLevel = isEnglishLevel(data.englishLevel) ? data.englishLevel : defaults.englishLevel;
  return {
    ...defaults,
    ...data,
    englishLevel,
    settings,
    clearedStages: Array.isArray(data.clearedStages) ? data.clearedStages : defaults.clearedStages,
    learnedExpressions: Array.isArray(data.learnedExpressions) ? data.learnedExpressions : defaults.learnedExpressions,
    titles: Array.isArray(data.titles) ? data.titles : defaults.titles,
    equipment: {
      ...defaults.equipment,
      ...(data.equipment ?? {}),
      owned: Array.isArray(data.equipment?.owned) ? data.equipment.owned : defaults.equipment.owned,
    },
    recentSentences: Array.isArray(data.recentSentences) ? data.recentSentences : defaults.recentSentences,
    wordUsage: data.wordUsage ?? defaults.wordUsage,
  };
};

export const loadPlayerData = (): PlayerData => {
  if (typeof window === "undefined") {
    return createDefaultPlayer();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultPlayer();
    }
    return mergePlayer(JSON.parse(raw) as Partial<PlayerData>);
  } catch {
    return createDefaultPlayer();
  }
};

export const savePlayerData = (player: PlayerData) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeForStorage(player)));
};

export const resetPlayerData = (): PlayerData => {
  const fresh = createDefaultPlayer();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }
  return fresh;
};

export const clearStoredApiKey = (player: PlayerData): PlayerData => {
  const next = {
    ...player,
    settings: {
      ...player.settings,
      saveApiKey: false,
      apiKey: undefined,
    },
  };
  savePlayerData(next);
  return next;
};

export const expToNextLevel = (level: number) => 90 + level * level * 24;

import { create } from 'zustand';
import type { CpuLevel, Difficulty, EquipmentId, EquipmentPreset, GameMode, MatchConfig, PlayerId, RpgDifficulty } from '../types';
import { DEFAULT_MAX_TURNS, DEFAULT_PIECE_COUNT } from '../game/rules';
import { DEFAULT_RPG_SAVE, DEFAULT_SAVE, loadSave, saveSave, type SaveData } from '../utils/storage';
import { defaultLoadouts } from '../game/engine';
import { MEDAL_BY_STAGE } from '../data/rpgMedals';

export type Screen =
  | 'home'
  | 'stageSelect'
  | 'equipSelect'
  | 'game'
  | 'result'
  | 'practice'
  | 'challenge'
  | 'collection'
  | 'settings'
  | 'rpgHome'
  | 'rpgBattle'
  | 'rpgResult';

interface Store {
  screen: Screen;
  match: MatchConfig | null;
  lastWinner: PlayerId | null;
  /** 直近の試合が RPG 戦闘だったか(結果画面の分岐用) */
  lastWasRpg: boolean;
  /** RPG で直近倒したボス(結果画面でのバナー用) */
  lastBossDefeated: number | null;
  /** RPG で直近獲得した勲章ID */
  lastMedalGained: string | null;
  save: SaveData;
  setScreen: (s: Screen) => void;
  startMatch: (partial: Partial<MatchConfig>) => void;
  setLoadout: (player: PlayerId, index: number, equipments: EquipmentId[]) => void;
  endMatch: (winner: PlayerId | null) => void;
  setStage: (stageId: string) => void;
  setMode: (mode: GameMode, difficulty?: Difficulty) => void;
  setSave: (updater: (s: SaveData) => SaveData) => void;
  resetLoadoutTo: (equip: EquipmentId) => void;
  // ===== RPG =====
  rpgStart: (opts: { continueFromSave: boolean }) => void;
  rpgSetDifficulty: (d: RpgDifficulty) => void;
  rpgEnterBattle: (stageLevel: number) => void;
  rpgResolve: (playerWon: boolean) => void;
  rpgResetProgress: () => void;
  // ===== 共通CPUレベル =====
  setCpuLevel: (lv: CpuLevel) => void;
  // ===== 装備ユーティリティ =====
  toggleEquipFavorite: (id: EquipmentId) => void;
  pushEquipRecent: (id: EquipmentId) => void;
  saveEquipPreset: (name: string, equipments: EquipmentId[]) => void;
  deleteEquipPreset: (id: string) => void;
  applyEquipPreset: (preset: EquipmentPreset) => void;
  // ===== ステージユーティリティ =====
  toggleStageFavorite: (id: string) => void;
  pushStageRecent: (id: string) => void;
}

const initial = {
  screen: 'home' as Screen,
  match: null as MatchConfig | null,
  lastWinner: null as PlayerId | null,
  lastWasRpg: false,
  lastBossDefeated: null as number | null,
  lastMedalGained: null as string | null,
  save: loadSave() ?? DEFAULT_SAVE,
};

export const useGameStore = create<Store>((set, get) => ({
  ...initial,
  setScreen: (s) => set({ screen: s }),
  startMatch: (partial) => {
    const prev = get().match;
    const pieceCount = partial.pieceCount ?? prev?.pieceCount ?? DEFAULT_PIECE_COUNT;
    const stageId = partial.stageId ?? prev?.stageId ?? 'desk_normal';
    const mode = partial.mode ?? prev?.mode ?? 'duo';
    const difficulty = partial.difficulty ?? prev?.difficulty ?? 'normal';
    const loadouts =
      partial.loadouts ??
      prev?.loadouts ?? {
        1: defaultLoadouts(pieceCount, 'none'),
        2: defaultLoadouts(pieceCount, 'none'),
      };
    set({
      match: {
        mode,
        difficulty,
        stageId,
        pieceCount,
        maxTurns: partial.maxTurns ?? DEFAULT_MAX_TURNS,
        loadouts,
      },
    });
  },
  setLoadout: (player, index, equipments) => {
    const m = get().match;
    if (!m) return;
    const loadouts = { ...m.loadouts };
    loadouts[player] = loadouts[player].map((l, i) => (i === index ? equipments.slice(0, 2) : l));
    set({ match: { ...m, loadouts } });
  },
  endMatch: (winner) => {
    const m = get().match;
    set({ lastWinner: winner, lastWasRpg: false, screen: 'result' });
    const save: SaveData = { ...get().save };
    if (winner === 1) save.winCount += 1;
    else if (winner === 2) save.loseCount += 1;
    save.tutorialDone = true;

    // 通常CPU戦のCPU連勝更新
    if (m?.mode === 'solo') {
      const streak = { ...(save.cpuStreak?.solo ?? { current: 0, max: 0 }) };
      if (winner === 2) {
        streak.current += 1;
        streak.max = Math.max(streak.max, streak.current);
      } else if (winner === 1) {
        streak.current = 0;
      }
      save.cpuStreak = { ...(save.cpuStreak ?? DEFAULT_SAVE.cpuStreak!), solo: streak };
    }
    if (m?.mode === 'challenge') {
      const streak = { ...(save.cpuStreak?.challenge ?? { current: 0, max: 0 }) };
      if (winner === 2) {
        streak.current += 1;
        streak.max = Math.max(streak.max, streak.current);
      } else if (winner === 1) {
        streak.current = 0;
      }
      save.cpuStreak = { ...(save.cpuStreak ?? DEFAULT_SAVE.cpuStreak!), challenge: streak };
    }

    // 段階的解放
    const unlockAtWins = (n: number, ids: string[]) => {
      if (save.winCount >= n) ids.forEach((id) => { if (!save.unlocks.includes(id)) save.unlocks.push(id); });
    };
    unlockAtWins(1, ['ruler']);
    unlockAtWins(2, ['redPen']);
    unlockAtWins(3, ['desk_bumper', 'clip']);
    unlockAtWins(5, ['scissors', 'magnet', 'pushpin', 'penCase']);
    unlockAtWins(10, ['protractor']);
    set({ save });
    saveSave(save);
  },
  setStage: (stageId) => {
    const m = get().match;
    set({
      match: m
        ? { ...m, stageId }
        : {
            mode: 'duo',
            difficulty: 'normal',
            stageId,
            pieceCount: DEFAULT_PIECE_COUNT,
            maxTurns: DEFAULT_MAX_TURNS,
            loadouts: {
              1: defaultLoadouts(DEFAULT_PIECE_COUNT, 'none'),
              2: defaultLoadouts(DEFAULT_PIECE_COUNT, 'none'),
            },
          },
    });
  },
  setMode: (mode, difficulty) => {
    const m = get().match;
    if (!m) {
      get().startMatch({ mode, difficulty });
    } else {
      set({ match: { ...m, mode, difficulty: difficulty ?? m.difficulty } });
    }
  },
  setSave: (updater) => {
    const next = updater(get().save);
    set({ save: next });
    saveSave(next);
  },
  resetLoadoutTo: (equip) => {
    const m = get().match;
    if (!m) return;
    const loadouts = {
      1: defaultLoadouts(m.pieceCount, equip),
      2: defaultLoadouts(m.pieceCount, equip),
    };
    set({ match: { ...m, loadouts } });
  },

  // ===== RPGモード =====
  rpgStart: ({ continueFromSave }) => {
    const save = { ...get().save };
    if (!save.rpg || !continueFromSave) {
      save.rpg = { ...DEFAULT_RPG_SAVE };
    }
    set({ save });
    saveSave(save);
    const lv = save.rpg?.currentStage ?? 1;
    get().rpgEnterBattle(lv);
  },
  rpgSetDifficulty: (d) => {
    const save = { ...get().save };
    save.rpg = { ...(save.rpg ?? DEFAULT_RPG_SAVE), selectedDifficulty: d };
    set({ save });
    saveSave(save);
  },
  rpgEnterBattle: (stageLevel) => {
    const save = { ...get().save };
    save.rpg = { ...(save.rpg ?? DEFAULT_RPG_SAVE), currentStage: stageLevel };
    set({ save, screen: 'rpgBattle', lastWasRpg: true, lastBossDefeated: null, lastMedalGained: null });
    saveSave(save);
  },
  rpgResolve: (playerWon) => {
    const save = { ...get().save };
    const rpg = { ...(save.rpg ?? DEFAULT_RPG_SAVE) };
    let bossDefeated: number | null = null;
    let medalGained: string | null = null;
    if (playerWon) {
      rpg.totalWins += 1;
      // ボス判定
      const medal = MEDAL_BY_STAGE[rpg.currentStage];
      if (medal) {
        if (!rpg.defeatedBosses.includes(rpg.currentStage)) {
          rpg.defeatedBosses.push(rpg.currentStage);
          rpg.bossClearCount += 1;
        }
        if (!rpg.medals.includes(medal.id)) {
          rpg.medals.push(medal.id);
          rpg.medalUnlockedAt[medal.id] = Date.now();
          medalGained = medal.id;
        }
        bossDefeated = rpg.currentStage;
      }
      // 次ステージ解放
      const nextLv = Math.min(500, rpg.currentStage + 1);
      rpg.maxUnlockedStage = Math.max(rpg.maxUnlockedStage, nextLv);
      rpg.currentStage = nextLv;
    } else {
      rpg.totalLosses += 1;
    }
    save.rpg = rpg;
    set({
      save,
      screen: 'rpgResult',
      lastWinner: playerWon ? 1 : 2,
      lastWasRpg: true,
      lastBossDefeated: bossDefeated,
      lastMedalGained: medalGained,
    });
    saveSave(save);
  },
  rpgResetProgress: () => {
    const save = { ...get().save };
    save.rpg = { ...DEFAULT_RPG_SAVE };
    set({ save });
    saveSave(save);
  },

  // ===== 共通CPUレベル(通常CPU戦+RPGの両方で使う) =====
  setCpuLevel: (lv) => {
    const save = { ...get().save, cpuLevel: lv };
    // RPG側の難易度もミラーさせて一貫性を出す
    if (save.rpg) save.rpg = { ...save.rpg, selectedDifficulty: lv };
    // 既存match.difficultyにも反映
    const m = get().match;
    if (m) set({ match: { ...m, difficulty: lv } });
    set({ save });
    saveSave(save);
  },

  toggleEquipFavorite: (id) => {
    const save = { ...get().save };
    const favs = new Set(save.equipFavorites ?? []);
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    save.equipFavorites = Array.from(favs);
    set({ save });
    saveSave(save);
  },
  pushEquipRecent: (id) => {
    const save = { ...get().save };
    const list = [id, ...(save.equipRecents ?? []).filter((x) => x !== id)].slice(0, 10);
    save.equipRecents = list;
    set({ save });
    saveSave(save);
  },
  saveEquipPreset: (name, equipments) => {
    const save = { ...get().save };
    const presets = [...(save.equipPresets ?? [])];
    const id = `preset_${Date.now()}`;
    presets.push({ id, name: name || `プリセット${presets.length + 1}`, equipments: equipments.slice(0, 2), createdAt: Date.now() });
    save.equipPresets = presets.slice(-10); // 最大10
    set({ save });
    saveSave(save);
  },
  deleteEquipPreset: (id) => {
    const save = { ...get().save };
    save.equipPresets = (save.equipPresets ?? []).filter((p) => p.id !== id);
    set({ save });
    saveSave(save);
  },
  applyEquipPreset: (preset) => {
    const m = get().match;
    if (!m) return;
    const eqs = preset.equipments.slice(0, 2);
    const loadouts = { ...m.loadouts };
    // アクティブプレイヤー1Pに全コマ同じプリセットを適用(シンプル)
    loadouts[1] = loadouts[1].map(() => [...eqs]);
    set({ match: { ...m, loadouts } });
  },

  toggleStageFavorite: (id) => {
    const save = { ...get().save };
    const favs = new Set(save.stageFavorites ?? []);
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    save.stageFavorites = Array.from(favs);
    set({ save });
    saveSave(save);
  },
  pushStageRecent: (id) => {
    const save = { ...get().save };
    const list = [id, ...(save.stageRecents ?? []).filter((x) => x !== id)].slice(0, 8);
    save.stageRecents = list;
    set({ save });
    saveSave(save);
  },
}));

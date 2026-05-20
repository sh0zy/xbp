import type { EquipmentItem } from "../types";

export const equipmentItems: EquipmentItem[] = [
  {
    id: "wooden-pencil",
    name: "Wooden Pencil",
    type: "weapon",
    description: "最初の一文を支える軽い鉛筆。攻撃力が少し上がる。",
    attack: 2,
    maxHp: 0,
    scoreBonus: 0,
    wordBonus: 0,
    comboBonus: 0,
    unlockStage: 1,
  },
  {
    id: "silver-pen",
    name: "Silver Pen",
    type: "weapon",
    description: "ていねいな英文を鋭く届けるペン。",
    attack: 6,
    maxHp: 0,
    scoreBonus: 2,
    wordBonus: 0,
    comboBonus: 0,
    unlockStage: 12,
  },
  {
    id: "magic-notebook",
    name: "Magic Notebook",
    type: "weapon",
    description: "語数を重ねるほど魔力が乗るノート。",
    attack: 9,
    maxHp: 0,
    scoreBonus: 3,
    wordBonus: 1,
    comboBonus: 0,
    unlockStage: 20,
  },
  {
    id: "grammar-sword",
    name: "Grammar Sword",
    type: "weapon",
    description: "文法の安定感を攻撃力に変える剣。",
    attack: 14,
    maxHp: 0,
    scoreBonus: 5,
    wordBonus: 1,
    comboBonus: 1,
    unlockStage: 40,
  },
  {
    id: "conversation-blade",
    name: "Conversation Blade",
    type: "weapon",
    description: "会話を続ける意志が光る最終武器。",
    attack: 20,
    maxHp: 0,
    scoreBonus: 8,
    wordBonus: 2,
    comboBonus: 2,
    unlockStage: 50,
  },
  {
    id: "school-uniform",
    name: "School Uniform",
    type: "armor",
    description: "落ち着いて短い英文を話すための服。",
    attack: 0,
    maxHp: 18,
    scoreBonus: 1,
    wordBonus: 0,
    comboBonus: 0,
    unlockStage: 5,
  },
  {
    id: "traveler-coat",
    name: "Traveler Coat",
    type: "armor",
    description: "旅行英会話の緊張を和らげるコート。",
    attack: 0,
    maxHp: 32,
    scoreBonus: 2,
    wordBonus: 1,
    comboBonus: 0,
    unlockStage: 15,
  },
  {
    id: "business-jacket",
    name: "Business Jacket",
    type: "armor",
    description: "丁寧な依頼や会議の発言を支えるジャケット。",
    attack: 0,
    maxHp: 52,
    scoreBonus: 4,
    wordBonus: 1,
    comboBonus: 0,
    unlockStage: 30,
  },
  {
    id: "dragon-shield",
    name: "Dragon Shield",
    type: "armor",
    description: "長い会話でも心が折れにくくなる盾。",
    attack: 0,
    maxHp: 80,
    scoreBonus: 4,
    wordBonus: 2,
    comboBonus: 1,
    unlockStage: 45,
  },
  {
    id: "please-ring",
    name: "Please Ring",
    type: "accessory",
    description: "pleaseやcould youを使うと会話の力が増す指輪。",
    attack: 0,
    maxHp: 0,
    scoreBonus: 2,
    wordBonus: 0,
    comboBonus: 1,
    unlockStage: 7,
  },
  {
    id: "because-amulet",
    name: "Because Amulet",
    type: "accessory",
    description: "理由を足す英文を強くするお守り。",
    attack: 2,
    maxHp: 0,
    scoreBonus: 4,
    wordBonus: 1,
    comboBonus: 1,
    unlockStage: 35,
  },
  {
    id: "example-charm",
    name: "Example Charm",
    type: "accessory",
    description: "具体例を出す会話を後押しするチャーム。",
    attack: 1,
    maxHp: 0,
    scoreBonus: 3,
    wordBonus: 1,
    comboBonus: 1,
    unlockStage: 25,
  },
  {
    id: "confidence-badge",
    name: "Confidence Badge",
    type: "accessory",
    description: "長文に挑戦する勇気を少し増やすバッジ。",
    attack: 3,
    maxHp: 16,
    scoreBonus: 5,
    wordBonus: 2,
    comboBonus: 2,
    unlockStage: 48,
  },
];

export const equipmentById = new Map(equipmentItems.map((item) => [item.id, item]));

export const getEquipmentById = (itemId?: string) => (itemId ? equipmentById.get(itemId) : undefined);

export const getEquipmentBonus = (ownedIds: string[], equippedIds: Array<string | undefined>) => {
  const owned = new Set(ownedIds);
  return equippedIds.reduce(
    (bonus, itemId) => {
      if (!itemId || !owned.has(itemId)) {
        return bonus;
      }
      const item = equipmentById.get(itemId);
      if (!item) {
        return bonus;
      }
      return {
        attack: bonus.attack + item.attack,
        maxHp: bonus.maxHp + item.maxHp,
        scoreBonus: bonus.scoreBonus + item.scoreBonus,
        wordBonus: bonus.wordBonus + item.wordBonus,
        comboBonus: bonus.comboBonus + item.comboBonus,
      };
    },
    { attack: 0, maxHp: 0, scoreBonus: 0, wordBonus: 0, comboBonus: 0 },
  );
};

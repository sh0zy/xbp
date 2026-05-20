import type { DifficultyConfig, Enemy, EnglishLevel, Stage, StageReward } from "../types";

export const difficultyConfigs: DifficultyConfig[] = [
  {
    level: "A1",
    label: "A1 超初心者",
    description: "短い英語から始めたい人向け。敵は弱く、ヒント多め。",
    target: "英語が苦手で、中学英語の最初から始めたい",
    motto: "短い英語から始めよう",
    enemyHpMultiplier: 0.6,
    enemyAttackMultiplier: 0.6,
    requiredWordsMultiplier: 0.5,
    scoreStrictness: 0.7,
    expMultiplier: 1,
    goldMultiplier: 1,
    hintLevel: "very_high",
  },
  {
    level: "A2",
    label: "A2 初級",
    description: "短い日常会話から、少し長めの文に挑戦したい人向け。",
    target: "短い文で日常会話を作れる",
    motto: "少し長い文に挑戦しよう",
    enemyHpMultiplier: 0.8,
    enemyAttackMultiplier: 0.8,
    requiredWordsMultiplier: 0.75,
    scoreStrictness: 0.85,
    expMultiplier: 1.1,
    goldMultiplier: 1,
    hintLevel: "high",
  },
  {
    level: "B1",
    label: "B1 中級",
    description: "理由や経験を足して、1〜2文の会話を作る標準難易度。",
    target: "日常会話をある程度作れる",
    motto: "理由をつけて話そう",
    enemyHpMultiplier: 1,
    enemyAttackMultiplier: 1,
    requiredWordsMultiplier: 1,
    scoreStrictness: 1,
    expMultiplier: 1.25,
    goldMultiplier: 1,
    hintLevel: "normal",
  },
  {
    level: "B2",
    label: "B2 中上級",
    description: "意見、理由、具体例、比較で戦う強敵モード。",
    target: "英語面接や留学準備にも使いたい",
    motto: "意見と具体例で戦おう",
    enemyHpMultiplier: 1.35,
    enemyAttackMultiplier: 1.25,
    requiredWordsMultiplier: 1.4,
    scoreStrictness: 1.2,
    expMultiplier: 1.5,
    goldMultiplier: 1,
    hintLevel: "low",
  },
  {
    level: "C1",
    label: "C1 上級",
    description: "長い英語で意見・理由・具体例を話したい人向け。敵はかなり強い。",
    target: "面接、プレゼン、ディスカッションに近い練習をしたい",
    motto: "論理と表現力で強敵を倒そう",
    enemyHpMultiplier: 1.8,
    enemyAttackMultiplier: 1.6,
    requiredWordsMultiplier: 2,
    scoreStrictness: 1.45,
    expMultiplier: 2,
    goldMultiplier: 2,
    hintLevel: "very_low",
  },
];

export const difficultyByLevel = new Map(difficultyConfigs.map((config) => [config.level, config]));

export const getDifficultyConfig = (level: EnglishLevel): DifficultyConfig => difficultyByLevel.get(level) ?? difficultyConfigs[0];

const wordRanges: Record<EnglishLevel, Array<{ maxStage: number; min: number; max: number }>> = {
  A1: [
    { maxStage: 10, min: 2, max: 4 },
    { maxStage: 30, min: 4, max: 7 },
    { maxStage: 50, min: 7, max: 10 },
  ],
  A2: [
    { maxStage: 10, min: 4, max: 6 },
    { maxStage: 30, min: 7, max: 12 },
    { maxStage: 50, min: 12, max: 16 },
  ],
  B1: [
    { maxStage: 10, min: 7, max: 10 },
    { maxStage: 30, min: 12, max: 18 },
    { maxStage: 50, min: 18, max: 25 },
  ],
  B2: [
    { maxStage: 10, min: 10, max: 15 },
    { maxStage: 30, min: 18, max: 28 },
    { maxStage: 50, min: 28, max: 40 },
  ],
  C1: [
    { maxStage: 10, min: 18, max: 25 },
    { maxStage: 30, min: 30, max: 45 },
    { maxStage: 50, min: 45, max: 70 },
  ],
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const getAdjustedRequiredWords = (stage: Stage, level: EnglishLevel): number => {
  const config = getDifficultyConfig(level);
  const range = wordRanges[level].find((item) => stage.id <= item.maxStage) ?? wordRanges[level][wordRanges[level].length - 1];
  return Math.round(clamp(stage.requiredWords * config.requiredWordsMultiplier, range.min, range.max));
};

const questionPools: Record<EnglishLevel, { normal: string[]; boss: string[] }> = {
  A1: {
    normal: ["Hello! What is your name?", "What food do you like?", "Do you like English?", "How are you today?"],
    boss: ["Please say hello and tell me your name.", "What do you like? Say it in simple English."],
  },
  A2: {
    normal: ["What do you like to do after school?", "Can you tell me your favorite food?", "Why do you want to learn English?", "Can you ask me politely?"],
    boss: ["Tell me what you like and add one simple reason.", "Can you ask for help politely and say why?"],
  },
  B1: {
    normal: ["Can you explain why learning English is useful?", "Tell me about your school life.", "What did you do last weekend?", "Can you give me one example?"],
    boss: ["Answer in one or two sentences with a reason and an example.", "Tell me about your experience and explain why it was important."],
  },
  B2: {
    normal: [
      "Do you think technology makes our lives better?",
      "What are the advantages and disadvantages of studying abroad?",
      "How would you solve this problem?",
      "Can you compare two options and explain your opinion?",
    ],
    boss: ["Give a two or three sentence answer with your opinion, reasons, and a concrete example.", "Explain both sides of the issue, then give your view."],
  },
  C1: {
    normal: [
      "To what extent do you think AI will change the way people learn languages?",
      "How should society balance convenience and privacy in the digital age?",
      "What qualities are necessary for effective global communication?",
      "Do you believe personal failure is essential for long-term growth? Explain your view with examples.",
    ],
    boss: [
      "Discuss this issue in three to five sentences with your opinion, reasoning, an example, and a final conclusion.",
      "Present a nuanced argument, acknowledge a possible counterargument, and explain your final position.",
    ],
  },
};

const levelExpressions: Record<EnglishLevel, string[]> = {
  A1: ["My name is Kota.", "I like soccer.", "I am happy.", "I want water."],
  A2: ["I like music because it is fun.", "I want to go to the station.", "I usually study English at night."],
  B1: [
    "I think English is useful because I can talk with many people.",
    "Last weekend, I went shopping with my friend.",
    "For example, I can use English when I travel.",
  ],
  B2: [
    "In my opinion, technology makes our lives more convenient, but we should not depend on it too much.",
    "One advantage is that we can learn different cultures.",
    "On the other hand, it can be difficult to communicate at first.",
  ],
  C1: [
    "From my perspective, AI can significantly improve language learning because it allows learners to receive immediate feedback.",
    "However, we should also be careful not to rely on technology too much.",
    "Therefore, I believe the best approach is to combine AI-based practice with real human interaction.",
  ],
};

const c1EnemyNames: Record<string, string> = {
  "tiny-slime": "Ancient Tiny Slime",
  "blue-slime": "Ancient Blue Slime",
  "slime-king": "Slime King EX",
  "grammar-demon": "Grammar Demon Overlord",
  "dark-english-lord": "Dark English Lord Ultimate",
};

export const getLeveledEnemyName = (enemy: Enemy, level: EnglishLevel): string => {
  if (level !== "C1") {
    return enemy.name;
  }
  if (c1EnemyNames[enemy.id]) {
    return c1EnemyNames[enemy.id];
  }
  return enemy.type === "boss" ? `${enemy.name} EX` : `Ancient ${enemy.name}`;
};

export const getLeveledQuestion = (stage: Stage, enemy: Enemy, level: EnglishLevel, turn: number): string => {
  if (level === "B1") {
    return enemy.questions[turn % enemy.questions.length];
  }
  const group = stage.isBoss ? questionPools[level].boss : questionPools[level].normal;
  return group[(turn + stage.id) % group.length];
};

export const getLeveledExpressions = (stage: Stage, level: EnglishLevel): string[] => {
  if (level === "B1") {
    return stage.recommendedExpressions;
  }
  return levelExpressions[level];
};

export const getLeveledMission = (stage: Stage, level: EnglishLevel, requiredWords: number): string => {
  const config = getDifficultyConfig(level);
  const c1Boss = level === "C1" && stage.isBoss ? "ボス戦では3〜5文で、反対意見への配慮も入れると大ダメージです。" : "";
  return `「${stage.theme}」について、${requiredWords}語以上の英語で返答しよう。現在の英語レベルは${config.label}です。${c1Boss}`;
};

export const getLeveledHint = (stage: Stage, enemy: Enemy, level: EnglishLevel, requiredWords: number): string => {
  const expression = getLeveledExpressions(stage, level)[0] ?? stage.recommendedExpressions[0];
  if (level === "A1") {
    return `${enemy.name}の質問に、例文をまねして答えてOKです。「${expression}」のように${requiredWords}語くらいで話してみよう。`;
  }
  if (level === "A2") {
    return `「${expression}」の形を使い、becauseやpleaseを足すと攻撃力が上がります。`;
  }
  if (level === "B2") {
    return `意見、理由、具体例、比較を入れると高スコアです。例: ${expression}`;
  }
  if (level === "C1") {
    return `C1 ADVANCED MODE: 結論、理由、具体例、必要なら反対意見への配慮を入れてください。短すぎる回答はダメージが大きく下がります。`;
  }
  return `${enemy.name} の質問に、${expression} のような表現を使って理由や経験を加えて答えてみよう。`;
};

export const getAdjustedEnemyMaxHp = (baseHp: number, stage: Stage, level: EnglishLevel): number => {
  const config = getDifficultyConfig(level);
  const bossBoost = level === "C1" && stage.isBoss ? 1.22 : 1;
  return Math.round(baseHp * config.enemyHpMultiplier * bossBoost);
};

export const getAdjustedEnemyAttack = (baseAttack: number, stage: Stage, level: EnglishLevel): number => {
  const config = getDifficultyConfig(level);
  const bossBoost = level === "C1" && stage.isBoss ? 1.12 : 1;
  return Math.round(baseAttack * config.enemyAttackMultiplier * bossBoost);
};

export const getAdjustedReward = (reward: StageReward, level: EnglishLevel): StageReward => {
  const config = getDifficultyConfig(level);
  return {
    ...reward,
    exp: Math.round(reward.exp * config.expMultiplier),
    gold: Math.round(reward.gold * config.goldMultiplier),
  };
};

export const getC1TitlesForStage = (stage: Stage, level: EnglishLevel): string[] => {
  if (level !== "C1") {
    return [];
  }
  if (stage.id === 50) {
    return ["C1 Dragon Slayer", "Global Communicator"];
  }
  if (stage.id >= 40 && stage.isBoss) {
    return ["Academic Adventurer"];
  }
  if (stage.id >= 30 && stage.isBoss) {
    return ["Critical Thinker"];
  }
  if (stage.id >= 10 && stage.isBoss) {
    return ["Advanced Speaker"];
  }
  return [];
};

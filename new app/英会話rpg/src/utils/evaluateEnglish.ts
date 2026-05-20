import type { ElementType, EvaluationRequest, EvaluationResult, Rank } from "../types";
import { getDifficultyConfig } from "../data/difficulty";

const elementWords: Record<ElementType, string[]> = {
  fire: ["fire", "hot", "flame", "burn", "passion", "strong"],
  water: ["water", "drink", "rain", "sea", "river", "clean"],
  ice: ["ice", "cold", "snow", "freeze", "winter"],
  thunder: ["thunder", "light", "fast", "power", "energy"],
  heal: ["help", "heal", "rest", "recover", "support", "care"],
  talk: ["hello", "please", "thank", "excuse", "sorry", "nice", "welcome"],
  normal: [],
};

const conversationPhrases = [
  "hello",
  "hi",
  "please",
  "thank",
  "sorry",
  "excuse",
  "would like",
  "could you",
  "can you",
  "nice",
  "welcome",
];

const reasoningPhrases = [
  "because",
  "so",
  "for example",
  "in my opinion",
  "i think",
  "i believe",
  "one reason",
  "compared",
  "if i were",
  "to conclude",
];

const levelBonusPhrases = {
  A1: ["hello", "my name is", "i am", "i like", "i want", "happy"],
  A2: ["because", "please", "thank you", "want to", "usually", "can you", "could you"],
  B1: ["because", "for example", "usually", "last weekend", "when i", "i learned", "i think"],
  B2: ["in my opinion", "on the other hand", "however", "for example", "compared with", "one advantage", "one disadvantage"],
  C1: [
    "from my perspective",
    "to some extent",
    "nevertheless",
    "consequently",
    "in contrast",
    "it depends on",
    "one possible solution is",
    "this suggests that",
    "although",
    "therefore",
  ],
};

const stopWords = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "am",
  "do",
  "does",
  "did",
  "you",
  "your",
  "me",
  "my",
  "i",
  "to",
  "of",
  "and",
  "or",
  "in",
  "on",
  "at",
  "for",
  "with",
  "can",
  "could",
  "would",
  "should",
  "what",
  "where",
  "why",
  "how",
]);

export const countEnglishWords = (text: string): number => {
  const matches = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g);
  return matches ? matches.length : 0;
};

const tokenize = (text: string): string[] => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];

const hasPhrase = (text: string, phrases: string[]) => {
  const normalized = text.toLowerCase();
  return phrases.some((phrase) => normalized.includes(phrase));
};

export const detectElement = (text: string): ElementType => {
  const normalized = text.toLowerCase();
  for (const element of ["fire", "water", "ice", "thunder", "heal", "talk"] as ElementType[]) {
    if (elementWords[element].some((word) => normalized.includes(word))) {
      return element;
    }
  }
  return "normal";
};

const rankFromScore = (score: number): Rank => {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getRelevanceScore = (userText: string, enemyMessage: string, mission: string) => {
  const userWords = new Set(tokenize(userText).filter((word) => !stopWords.has(word)));
  const promptWords = tokenize(`${enemyMessage} ${mission}`).filter((word) => !stopWords.has(word));
  if (promptWords.length === 0 || userWords.size === 0) {
    return 0;
  }
  const matches = promptWords.filter((word) => userWords.has(word));
  return clamp(matches.length * 4, 0, 12);
};

const getRepetitionPenalty = (words: string[]) => {
  if (words.length < 5) {
    return 0;
  }
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  const maxRepeat = Math.max(...counts.values());
  const repeatRatio = maxRepeat / words.length;
  return repeatRatio > 0.34 ? 12 : repeatRatio > 0.25 ? 6 : 0;
};

const japanesePenalty = (text: string) => {
  const japaneseChars = text.match(/[\u3040-\u30ff\u3400-\u9fff]/g)?.length ?? 0;
  if (japaneseChars === 0) {
    return 0;
  }
  const visibleChars = text.replace(/\s/g, "").length || 1;
  const ratio = japaneseChars / visibleChars;
  return ratio > 0.35 ? 22 : ratio > 0.12 ? 12 : 5;
};

const inferIntent = (request: EvaluationRequest, userText: string) => {
  const source = `${request.mission} ${request.enemyMessage} ${userText}`.toLowerCase();
  if (source.includes("name") || source.includes("introduce") || source.includes("自己紹介")) return "self_introduction";
  if (source.includes("thank") || source.includes("感謝")) return "thanks";
  if (source.includes("sorry") || source.includes("謝")) return "apology";
  if (source.includes("where") || source.includes("station") || source.includes("direction")) return "directions";
  if (source.includes("order") || source.includes("cafe")) return "ordering";
  if (source.includes("opinion") || source.includes("think")) return "opinion";
  if (source.includes("problem") || source.includes("solution")) return "problem_solving";
  return "conversation";
};

const makeNaturalExpression = (text: string, requiredWords: number) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return requiredWords <= 5
      ? "Hello, my name is Kota, and I like learning English."
      : "I think learning English is useful because I can talk with more people and enjoy new experiences.";
  }
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/\s+/g, " ");
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
};

export const evaluateEnglish = (request: EvaluationRequest): EvaluationResult => {
  const text = request.userText.trim();
  const config = getDifficultyConfig(request.selectedEnglishLevel);
  const words = tokenize(text);
  const wordCount = words.length;
  const lengthClear = wordCount >= request.requiredWords;
  const lengthRatio = clamp(wordCount / request.requiredWords, 0, 1.25);
  const hasConversation = hasPhrase(text, conversationPhrases);
  const hasReasoning = hasPhrase(text, reasoningPhrases);
  const hasLevelPhrase = hasPhrase(text, levelBonusPhrases[request.selectedEnglishLevel]);
  const relevance = getRelevanceScore(text, request.enemyMessage, request.mission);
  const repetition = getRepetitionPenalty(words);
  const japanese = japanesePenalty(text);
  const startsLikeSentence = /^[a-z]/i.test(text);
  const hasEnding = /[.!?]$/.test(text);
  const sentenceCount = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
  const hasExample = hasPhrase(text, ["for example", "for instance", "such as", "a concrete example"]);
  const hasCounterpoint = hasPhrase(text, ["however", "although", "nevertheless", "on the other hand", "some people may argue", "that concern"]);

  let score = 12;
  if (text.length > 0) score += 14;
  score += Math.round(lengthRatio * 30);
  score += relevance;
  if (hasConversation) score += 9;
  if (hasReasoning) score += request.stage >= 25 ? 14 : 7;
  if (hasLevelPhrase) score += request.selectedEnglishLevel === "C1" ? 12 : 8;
  if (startsLikeSentence) score += 4;
  if (hasEnding || wordCount < 7) score += 3;
  if (request.stage >= 31 && !hasReasoning) score -= request.selectedEnglishLevel === "A1" ? 2 : 8;
  if (request.stage >= 41 && wordCount < request.requiredWords + 4) score -= request.selectedEnglishLevel === "A1" ? 1 : 5;
  if (request.selectedEnglishLevel === "A1" && hasPhrase(text, ["hello", "i am", "i like", "my name is"])) score += 8;
  if (request.selectedEnglishLevel === "A2" && hasPhrase(text, ["because", "please", "want to"])) score += 6;
  if (request.selectedEnglishLevel === "B1") {
    if (sentenceCount >= 2) score += 6;
    if (hasExample) score += 5;
  }
  if (request.selectedEnglishLevel === "B2") {
    if (sentenceCount >= 2) score += 8;
    if (hasExample && hasReasoning) score += 8;
    if (!hasReasoning) score -= 8;
  }
  if (request.selectedEnglishLevel === "C1") {
    if (sentenceCount >= 3) score += 10;
    if (hasExample) score += 8;
    if (hasCounterpoint) score += 10;
    if (!hasReasoning) score -= 16;
    if (!hasExample && request.stage >= 20) score -= 8;
    if (sentenceCount < 2) score -= 14;
    if (wordCount < request.requiredWords * 0.75) score -= 18;
  }
  if (!lengthClear) score -= Math.round((1 - lengthRatio) * 18);
  score -= (request.selectedEnglishLevel === "A1" ? Math.round(repetition * 0.45) : repetition) + (request.selectedEnglishLevel === "A1" ? Math.round(japanese * 0.4) : japanese);
  score += Math.round((1 - config.scoreStrictness) * 20);
  score -= Math.round(Math.max(0, config.scoreStrictness - 1) * 24);

  score = clamp(score, 0, 100);
  const rank = rankFromScore(score);
  const element = detectElement(text);
  const damageBonus = clamp(0.5 + score / 70 + (lengthClear ? 0.12 : request.selectedEnglishLevel === "C1" ? -0.32 : -0.12), 0.5, 2);

  const goodPoints: string[] = [];
  if (wordCount > 0) goodPoints.push("英語で返答できています");
  if (lengthClear) goodPoints.push(`必要語数${request.requiredWords}語をクリアしています`);
  if (hasConversation) goodPoints.push("会話で使いやすい表現が入っています");
  if (hasReasoning) goodPoints.push("理由や意見を足せています");
  if (relevance >= 8) goodPoints.push("敵の質問に関係する内容で答えています");
  if (hasLevelPhrase) goodPoints.push(`${request.selectedEnglishLevel}らしい表現を使えています`);
  if (request.selectedEnglishLevel === "C1" && hasCounterpoint) goodPoints.push("反対意見や別の見方にも配慮できています");

  const improvements: string[] = [];
  if (!lengthClear) improvements.push(`あと${request.requiredWords - wordCount}語ほど足すと攻撃力が上がります`);
  if (!hasReasoning && request.stage >= 25) improvements.push("becauseやfor exampleを使うと理由と具体例が伝わります");
  if (!hasConversation && request.stage <= 15) improvements.push("hello, please, thank youなどを入れると自然です");
  if (request.selectedEnglishLevel === "B2" && sentenceCount < 2) improvements.push("B2では2文以上で、意見・理由・具体例をつなげると高評価です");
  if (request.selectedEnglishLevel === "C1" && sentenceCount < 3) improvements.push("C1では3文以上で、結論・理由・具体例・まとめを入れると強くなります");
  if (request.selectedEnglishLevel === "C1" && !hasCounterpoint) improvements.push("howeverやneverthelessで反対意見への配慮を入れるとC1らしくなります");
  if (request.selectedEnglishLevel === "C1" && !hasLevelPhrase) improvements.push("from my perspective, to some extent, consequently などの上級表現も試してみましょう");
  if (japanese > 0) improvements.push("日本語を少し減らして、知っている英語だけで言い換えてみましょう");
  if (repetition > 0) improvements.push("同じ単語の繰り返しを減らすと、より自然に聞こえます");
  if (improvements.length === 0) improvements.push("次は理由や具体例をもう一つ足してみましょう");

  const battleMessageByRank: Record<Rank, string> = {
    S: "Perfect English Strike!",
    A: "自然な英語で大ダメージ！",
    B: "いい英文！",
    C: "英語の力が届いた！",
    D: "少し伝わった！",
  };

  return {
    success: true,
    score,
    rank,
    wordCount,
    requiredWords: request.requiredWords,
    lengthClear,
    damageBonus,
    element,
    detectedIntent: inferIntent(request, text),
    goodPoints: goodPoints.length ? goodPoints : ["まず英語で返す挑戦ができました"],
    improvements,
    naturalExpression: makeNaturalExpression(text, request.requiredWords),
    shortExplanationJa: lengthClear
      ? "意味は伝わります。さらに理由や具体例を入れると、もっと強い英文になります。"
      : "短くても攻撃できます。語数を少し足すと、ダメージが上がります。",
    enemyReply: lengthClear
      ? "Nice answer! Can you tell me one more thing?"
      : "I understood a little. Try adding more words next time!",
    battleMessage: battleMessageByRank[rank],
  };
};

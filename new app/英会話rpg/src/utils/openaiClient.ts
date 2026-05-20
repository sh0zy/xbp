import type { EvaluationRequest, EvaluationResponse, EvaluationResult, GameSettings, Rank, ElementType } from "../types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const ranks = new Set<Rank>(["S", "A", "B", "C", "D"]);
const elements = new Set<ElementType>(["fire", "water", "ice", "thunder", "heal", "talk", "normal"]);
const DEFAULT_MODEL = "gpt-5.4";

const normalizeModelName = (model?: string) => {
  const trimmed = model?.trim();
  if (!trimmed) {
    return DEFAULT_MODEL;
  }
  if (trimmed.toLowerCase() === "gpt5.4") {
    return "gpt-5.4";
  }
  return trimmed;
};

const fallback = (message = "AI採点に接続できなかったため、通常採点で続けます。"): EvaluationResponse => ({
  success: false,
  fallback: true,
  message,
});

const buildPrompt = (request: EvaluationRequest) => `あなたは、初心者向け英会話RPGアプリの英語コーチ兼ゲームマスターです。

ユーザーの英文を評価してください。

目的:
- 英語学習者を否定しすぎない
- 改善点は具体的に伝える
- RPGバトルとして楽しく返す
- 日本語でわかりやすく説明する
- 出力は必ずJSONのみ

評価対象:
- ユーザーの英文: ${request.userText}
- 敵の名前: ${request.enemyName}
- 敵のセリフ: ${request.enemyMessage}
- 現在のステージ: ${request.stage}
- selectedEnglishLevel: ${request.selectedEnglishLevel}
- 必要語数: ${request.requiredWords}
- ミッション: ${request.mission}
- 会話履歴: ${request.battleContext}

現在のユーザーの英語レベルは ${request.selectedEnglishLevel} です。
このレベルに合わせて評価してください。

A1の場合:
- 文法ミスに寛容
- 短い文でも褒める
- 簡単な改善案を出す
- 日本語説明をやさしくする

A2の場合:
- 短い理由説明を促す
- 基本文法を中心に直す

B1の場合:
- 理由、経験、具体例を評価する
- 1〜2文で自然な会話を目指す

B2の場合:
- 意見、比較、具体例、自然な接続を評価する
- 表現の幅も見る

C1の場合:
- 論理性、説得力、自然な語彙、文のつながりを厳しく評価する
- 内容が浅い場合はスコアを下げる
- 反対意見への配慮や具体例があると高評価
- より自然で上級らしい表現を提案する

評価項目:
1. 敵の質問に答えているか
2. 文法
3. 自然さ
4. 必要語数
5. 丁寧さ
6. 理由説明
7. 会話としての適切さ
8. RPG攻撃としての強さ

scoreは0〜100。
rankは S / A / B / C / D。
damageBonusは0.5〜2.0。
elementは以下から選ぶ。
- fire
- water
- ice
- thunder
- heal
- talk
- normal

返却形式は必ず次のJSONに揃えてください。
{
  "success": true,
  "score": 85,
  "rank": "A",
  "wordCount": 12,
  "requiredWords": ${request.requiredWords},
  "lengthClear": true,
  "damageBonus": 1.4,
  "element": "talk",
  "detectedIntent": "self_introduction",
  "goodPoints": ["自己紹介として意味が伝わっています"],
  "improvements": ["becauseを使うと理由も伝えられます"],
  "naturalExpression": "My name is Kota, and I like playing games because they are exciting.",
  "shortExplanationJa": "意味はしっかり伝わります。理由を加えるとさらに強い英文になります。",
  "enemyReply": "Nice answer! Can you tell me one more thing about yourself?",
  "battleMessage": "Your English words became a bright talking slash!"
}

必ずJSONのみで返す。`;

const extractText = (data: unknown): string => {
  const response = data as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  if (typeof response.output_text === "string") {
    return response.output_text;
  }
  const chunks = response.output?.flatMap((item) => item.content ?? []).map((content) => content.text).filter(Boolean);
  return chunks?.join("\n") ?? "";
};

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON object in response");
    }
    return JSON.parse(match[0]);
  }
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalizeResult = (raw: unknown, request: EvaluationRequest): EvaluationResult | null => {
  const value = raw as Partial<EvaluationResult>;
  if (value.success !== true) {
    return null;
  }
  const rank = ranks.has(value.rank as Rank) ? (value.rank as Rank) : "C";
  const element = elements.has(value.element as ElementType) ? (value.element as ElementType) : "normal";
  const wordCount = typeof value.wordCount === "number" ? value.wordCount : request.userText.trim().split(/\s+/).filter(Boolean).length;
  return {
    success: true,
    score: clamp(Number(value.score ?? 50), 0, 100),
    rank,
    wordCount,
    requiredWords: request.requiredWords,
    lengthClear: Boolean(value.lengthClear ?? wordCount >= request.requiredWords),
    damageBonus: clamp(Number(value.damageBonus ?? 1), 0.5, 2),
    element,
    detectedIntent: String(value.detectedIntent ?? "conversation"),
    goodPoints: Array.isArray(value.goodPoints) ? value.goodPoints.map(String).slice(0, 4) : ["英語で返答できています"],
    improvements: Array.isArray(value.improvements) ? value.improvements.map(String).slice(0, 4) : ["理由や具体例を足してみましょう"],
    naturalExpression: String(value.naturalExpression ?? request.userText),
    shortExplanationJa: String(value.shortExplanationJa ?? "意味は伝わります。少しずつ自然な表現にしていきましょう。"),
    enemyReply: String(value.enemyReply ?? "Nice answer! Keep going."),
    battleMessage: String(value.battleMessage ?? "Your English words turned into an attack!"),
  };
};

export const evaluateWithOpenAI = async (
  request: EvaluationRequest,
  settings: GameSettings,
): Promise<EvaluationResponse> => {
  const apiKey = settings.apiKey?.trim();
  if (!settings.aiScoring || !apiKey) {
    return fallback("AI採点がOFF、またはAPIキー未設定のため、通常採点で続けます。");
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: normalizeModelName(settings.model),
        input: buildPrompt(request),
        max_output_tokens: 700,
      }),
    });

    if (!response.ok) {
      return fallback();
    }

    const data = await response.json();
    const parsed = parseJson(extractText(data));
    const result = normalizeResult(parsed, request);
    return result ?? fallback();
  } catch {
    return fallback();
  }
};

export const testOpenAIConnection = async (apiKey: string, model: string): Promise<{ ok: boolean; message: string }> => {
  const safeKey = apiKey.trim();
  if (!safeKey) {
    return { ok: false, message: "APIキーを入力してください。" };
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${safeKey}`,
      },
      body: JSON.stringify({
        model: normalizeModelName(model),
        input: "Return only this JSON: {\"ok\":true}",
        max_output_tokens: 40,
      }),
    });
    return response.ok
      ? { ok: true, message: "接続テストに成功しました。" }
      : { ok: false, message: "接続できませんでした。モデル名またはAPIキーを確認してください。" };
  } catch {
    return { ok: false, message: "ネットワークまたはAPI接続で問題が発生しました。" };
  }
};

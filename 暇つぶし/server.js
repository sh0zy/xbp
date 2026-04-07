import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// compute __dirname equivalent in ES module
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// OpenAI 設定
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.MODEL || 'gpt-4o-mini';
const useSpeechToText = process.env.USE_SPEECH_TO_TEXT === 'true';
const useTextToSpeech = process.env.USE_TEXT_TO_SPEECH === 'true';

const client = new OpenAI({
  apiKey: apiKey,
});

const useMock = !apiKey;

if (useMock) {
  console.warn('\u26a0\ufe0f  WARNING: OPENAI_API_KEY not set. Using mock replies for development.');
  console.warn('\u2705 To enable real OpenAI API:');
  console.warn('   1. Get API key from https://platform.openai.com/api-keys');
  console.warn('   2. Add OPENAI_API_KEY to .env file');
  console.warn('   3. Restart the server\n');
} else {
  console.log(`✅ OpenAI API configured with model: ${model}`);
  console.log(`🔊 Speech-to-Text: ${useSpeechToText ? 'enabled' : 'disabled'}`);
  console.log(`🔊 Text-to-Speech: ${useTextToSpeech ? 'enabled' : 'disabled'}\n`);
}

function generateMockReply({ userText, theme, formality, level, roleplayId, history }) {
  // very small deterministic rule-based replies for offline/demo use
  const ut = (userText || "").trim();
  if (!ut) return "Could you say that again?";

  // Roleplay: give short character responses depending on scenario
  if (theme === 'roleplay' && roleplayId) {
    switch (roleplayId) {
      case 'airport_checkin':
        return "Hello! May I see your passport, please?";
      case 'immigration':
        return "Good afternoon. What is the purpose of your visit?";
      case 'hotel_checkin':
        return "Welcome. Do you have a reservation under your name?";
      case 'restaurant_order':
        return "Hi! Are you ready to order, or do you need a moment?";
      case 'travel_trouble':
        return "I'm sorry to hear that. What happened and where are you now?";
      default:
        return "Okay. Let's continue the roleplay.";
    }
  }

  // travel / business / daily simple heuristics
  if (theme === 'travel') {
    if (ut.toLowerCase().includes('ticket') || ut.toLowerCase().includes('flight')) {
      return "Where are you flying to? Can I help you check in?";
    }
    return "How long will you stay and where will you go?";
  }

  if (theme === 'business') {
    return `Thanks for your message. Could you summarize the main point in one sentence?`;
  }

  // default daily
  // if user asked a question, answer briefly; otherwise prompt follow-up
  if (ut.endsWith('?')) {
    return "That's an interesting question. In short, yes.";
  }

  // short encouragement
  return "Nice! Tell me more — what happened next?";
}

// ===== テーマ別プロンプト =====
function buildSystemPrompt({ theme, formality, level, speed }) {
  const base = [
    "You are a friendly English conversation partner.",
    "Always reply in English only.",
    "Keep your replies short (1-3 sentences).",
    `The user's English level is ${level}.`,
  ];

  if (formality === "casual") base.push("Use casual, friendly English.");
  if (formality === "polite") base.push("Use polite, professional English.");
  if (formality === "neutral") base.push("Use natural, neutral English.");

  if (speed === "slow") base.push("Imagine you are speaking slowly and clearly.");
  if (speed === "fast") base.push("Imagine you are speaking slightly fast.");
  if (speed === "normal") base.push("Speak at a natural pace.");

  if (theme === "daily") {
    base.push("The theme is daily small talk.");
  }
  if (theme === "travel") {
    base.push("The theme is travel English (airport, hotel, restaurant).");
  }
  if (theme === "business") {
    base.push("The theme is business English (meetings, emails, office).");
  }
  if (theme === "roleplay") {
    base.push("The theme is roleplay. Stay in character.");
  }

  return base.join(" ");
}

// ===== ロールプレイシナリオ =====
function buildRoleplayScenario(id) {
  switch (id) {
    case "airport_checkin":
      return `
You are an airport check-in staff member.
Start with: "Hello! May I see your passport, please?"
Keep replies short and realistic.
`;
    case "immigration":
      return `
You are an immigration officer.
Start with: "Good afternoon. What is the purpose of your visit?"
Use polite, formal English.
`;
    case "hotel_checkin":
      return `
You are a hotel receptionist.
Start with: "Welcome to Ocean View Hotel. Do you have a reservation?"
`;
    case "restaurant_order":
      return `
You are a waiter at a restaurant.
Start with: "Hi! Are you ready to order?"
`;
    case "travel_trouble":
      return `
You are a helpful local person.
Start with: "You look worried. What happened?"
`;
    default:
      return "";
  }
}

app.use(cors());
app.use(express.json());
// serve static files; prefer a `public` directory if present, otherwise fall back to root
app.use(express.static("public"));
// if there is no public directory (index.html in root), allow serving from project root too
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(__dirname));
}

// ===== /api/chat =====
app.post("/api/chat", async (req, res) => {
  try {
    const {
      userText,
      theme = "daily",
      formality = "neutral",
      level = "B1",
      speed = "normal",
      roleplayId = null,
      history = [],
    } = req.body;

    const systemPrompt = buildSystemPrompt({ theme, formality, level, speed });
    const scenario = theme === "roleplay" ? buildRoleplayScenario(roleplayId) : "";

    // If no API key is configured, return a deterministic mock reply so the app
    // can run locally without hitting OpenAI. This keeps responses short and
    // useful for demo / development.
    if (useMock) {
      const reply = generateMockReply({ userText, theme, formality, level, roleplayId, history });
      console.log('Using mock reply for:', userText);
      return res.json({ reply });
    }

    const messages = [
      { role: "system", content: systemPrompt },
    ];

    if (scenario) messages.push({ role: "system", content: scenario });

    messages.push(...history.slice(-6));
    messages.push({ role: "user", content: userText });

    const completion = await client.chat.completions.create({
      model: model,
      messages,
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Wave Talk backend running at http://localhost:${port}`);
});
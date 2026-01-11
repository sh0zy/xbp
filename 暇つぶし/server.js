import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
app.use(express.static("public"));

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

    const messages = [
      { role: "system", content: systemPrompt },
    ];

    if (scenario) messages.push({ role: "system", content: scenario });

    messages.push(...history.slice(-6));
    messages.push({ role: "user", content: userText });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
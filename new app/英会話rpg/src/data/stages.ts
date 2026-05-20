import type { Stage } from "../types";

type StageSeed = Omit<Stage, "mission" | "hintJa" | "recommendedExpressions" | "reward"> & {
  enemy: string;
  expressions: string[];
};

const seeds: StageSeed[] = [
  { id: 1, name: "Hello Slime Road", enemyId: "tiny-slime", enemy: "Tiny Slime", theme: "あいさつ", requiredWords: 3, isBoss: false, expressions: ["Hello.", "Nice to meet you.", "How are you?"] },
  { id: 2, name: "My Name Cave", enemyId: "blue-slime", enemy: "Blue Slime", theme: "自己紹介", requiredWords: 3, isBoss: false, expressions: ["My name is...", "I am from...", "I like..."] },
  { id: 3, name: "Favorite Food Field", enemyId: "word-rat", enemy: "Word Rat", theme: "好きな食べ物", requiredWords: 4, isBoss: false, expressions: ["I like curry.", "My favorite food is...", "It tastes good."] },
  { id: 4, name: "Hobby Forest", enemyId: "sleepy-bat", enemy: "Sleepy Bat", theme: "趣味", requiredWords: 4, isBoss: false, expressions: ["I like playing games.", "My hobby is...", "I enjoy..."] },
  { id: 5, name: "Slime King Castle", enemyId: "slime-king", enemy: "Slime King", theme: "あいさつと自己紹介", requiredWords: 5, isBoss: true, expressions: ["Hello, my name is...", "I am happy to meet you.", "I like..."] },
  { id: 6, name: "Please Bridge", enemyId: "tiny-slime", enemy: "Tiny Slime", theme: "pleaseを使う", requiredWords: 5, isBoss: false, expressions: ["Can I have..., please?", "Please help me.", "Could you...?"] },
  { id: 7, name: "Thank You Lake", enemyId: "blue-slime", enemy: "Blue Slime", theme: "感謝", requiredWords: 5, isBoss: false, expressions: ["Thank you for...", "I really appreciate it.", "That is very kind."] },
  { id: 8, name: "Sorry Cave", enemyId: "question-ghost", enemy: "Question Ghost", theme: "謝る", requiredWords: 6, isBoss: false, expressions: ["I am sorry.", "I apologize for...", "It was my mistake."] },
  { id: 9, name: "Help Me Forest", enemyId: "lost-wolf", enemy: "Lost Wolf", theme: "助けを求める", requiredWords: 7, isBoss: false, expressions: ["Could you help me?", "I need your help.", "Can you show me...?"] },
  { id: 10, name: "Forest Boss Gate", enemyId: "forest-boss-troll", enemy: "Forest Boss Troll", theme: "お願い・道案内", requiredWords: 8, isBoss: true, expressions: ["Could you tell me the way?", "Please go straight.", "Turn left at..."] },
  { id: 11, name: "Station Road", enemyId: "lost-wolf", enemy: "Lost Wolf", theme: "駅への道案内", requiredWords: 8, isBoss: false, expressions: ["Go straight.", "The station is near...", "Turn right at the corner."] },
  { id: 12, name: "Left Right Maze", enemyId: "forest-goblin", enemy: "Forest Goblin", theme: "turn left / turn right", requiredWords: 8, isBoss: false, expressions: ["Turn left.", "Turn right.", "Go past the shop."] },
  { id: 13, name: "Map Tower", enemyId: "question-ghost", enemy: "Question Ghost", theme: "場所を聞く", requiredWords: 9, isBoss: false, expressions: ["Where is...?", "How can I get to...?", "Is it near here?"] },
  { id: 14, name: "Hotel Street", enemyId: "hotel-ogre", enemy: "Hotel Ogre", theme: "ホテル予約", requiredWords: 10, isBoss: false, expressions: ["I have a reservation.", "I would like to check in.", "Could I have...?"] },
  { id: 15, name: "Travel Dragon Port", enemyId: "travel-dragon", enemy: "Travel Dragon", theme: "旅行英会話", requiredWords: 10, isBoss: true, expressions: ["I want to visit...", "I will stay for...", "Could you recommend...?"] },
  { id: 16, name: "Airport Check-in", enemyId: "airport-phantom", enemy: "Airport Phantom", theme: "空港での会話", requiredWords: 11, isBoss: false, expressions: ["I would like to check in.", "Here is my passport.", "Where is the gate?"] },
  { id: 17, name: "Passport Hall", enemyId: "airport-phantom", enemy: "Airport Phantom", theme: "パスポート確認", requiredWords: 11, isBoss: false, expressions: ["Here is my passport.", "I am traveling for...", "I will stay in..."] },
  { id: 18, name: "Sightseeing Hill", enemyId: "lost-wolf", enemy: "Lost Wolf", theme: "観光したい場所", requiredWords: 12, isBoss: false, expressions: ["I want to see...", "I am interested in...", "I would like to visit..."] },
  { id: 19, name: "Souvenir Shop", enemyId: "shop-troll", enemy: "Shop Troll", theme: "お土産を買う", requiredWords: 12, isBoss: false, expressions: ["How much is this?", "I would like to buy...", "Do you have...?"] },
  { id: 20, name: "School Lich Library", enemyId: "school-lich", enemy: "School Lich", theme: "学校生活", requiredWords: 12, isBoss: true, expressions: ["My favorite subject is...", "I study English because...", "After school, I usually..."] },
  { id: 21, name: "Classroom Dungeon", enemyId: "homework-spider", enemy: "Homework Spider", theme: "授業", requiredWords: 13, isBoss: false, expressions: ["In class, I learned...", "I have a question about...", "Could you explain...?"] },
  { id: 22, name: "Homework Cave", enemyId: "homework-spider", enemy: "Homework Spider", theme: "宿題", requiredWords: 13, isBoss: false, expressions: ["I finished my homework.", "I need more time because...", "The problem was difficult."] },
  { id: 23, name: "Friend Plaza", enemyId: "question-ghost", enemy: "Question Ghost", theme: "友達に質問", requiredWords: 14, isBoss: false, expressions: ["What do you think about...?", "Would you like to...?", "Can I ask you...?"] },
  { id: 24, name: "Club Activity Arena", enemyId: "debate-knight", enemy: "Debate Knight", theme: "部活・サークル", requiredWords: 15, isBoss: false, expressions: ["I joined the club because...", "We practice every week.", "It helps me become..."] },
  { id: 25, name: "Cafe Hydra Kitchen", enemyId: "cafe-hydra", enemy: "Cafe Hydra", theme: "カフェ注文", requiredWords: 15, isBoss: true, expressions: ["I would like to order...", "Could I get it without...?", "May I have the bill?"] },
  { id: 26, name: "Order Counter", enemyId: "shop-troll", enemy: "Shop Troll", theme: "注文する", requiredWords: 16, isBoss: false, expressions: ["I would like...", "Could you make it...?", "For here, please."] },
  { id: 27, name: "Favorite Menu Road", enemyId: "word-rat", enemy: "Word Rat", theme: "好きなメニューを説明", requiredWords: 16, isBoss: false, expressions: ["My favorite menu is...", "I like it because...", "It is better when..."] },
  { id: 28, name: "Complaint Street", enemyId: "grammar-goblin", enemy: "Grammar Goblin", theme: "丁寧に困りごとを伝える", requiredWords: 17, isBoss: false, expressions: ["Excuse me, there is a problem.", "Could you check this?", "I am afraid that..."] },
  { id: 29, name: "Request Tower", enemyId: "debate-knight", enemy: "Debate Knight", theme: "丁寧な依頼", requiredWords: 18, isBoss: false, expressions: ["Would it be possible to...?", "Could you please...?", "I would appreciate it if..."] },
  { id: 30, name: "Business Chimera Office", enemyId: "business-chimera", enemy: "Business Chimera", theme: "ビジネス英語", requiredWords: 18, isBoss: true, expressions: ["Thank you for your message.", "I would like to confirm...", "Could we discuss...?"] },
  { id: 31, name: "Email Valley", enemyId: "email-wyvern", enemy: "Email Wyvern", theme: "メール表現", requiredWords: 19, isBoss: false, expressions: ["Thank you for your email.", "I am writing to ask...", "Please let me know..."] },
  { id: 32, name: "Meeting Room", enemyId: "meeting-golem", enemy: "Meeting Golem", theme: "会議で発言", requiredWords: 20, isBoss: false, expressions: ["In my opinion...", "I agree with that because...", "May I add one point?"] },
  { id: 33, name: "Schedule Bridge", enemyId: "email-wyvern", enemy: "Email Wyvern", theme: "予定調整", requiredWords: 20, isBoss: false, expressions: ["Are you available on...?", "Could we move the meeting?", "That time works for me."] },
  { id: 34, name: "Proposal Gate", enemyId: "meeting-golem", enemy: "Meeting Golem", theme: "提案する", requiredWords: 21, isBoss: false, expressions: ["I suggest that we...", "This idea may help because...", "For example, we can..."] },
  { id: 35, name: "Opinion Giant Mountain", enemyId: "opinion-giant", enemy: "Opinion Giant", theme: "意見と理由", requiredWords: 22, isBoss: true, expressions: ["In my opinion...", "I think so because...", "One reason is..."] },
  { id: 36, name: "Because Canyon", enemyId: "debate-knight", enemy: "Debate Knight", theme: "becauseを使う", requiredWords: 23, isBoss: false, expressions: ["I think ... because...", "This is important because...", "I chose it because..."] },
  { id: 37, name: "Example Desert", enemyId: "grammar-goblin", enemy: "Grammar Goblin", theme: "具体例を出す", requiredWords: 24, isBoss: false, expressions: ["For example...", "A good example is...", "This happened when..."] },
  { id: 38, name: "Compare Castle", enemyId: "meeting-golem", enemy: "Meeting Golem", theme: "比較する", requiredWords: 24, isBoss: false, expressions: ["Compared with...", "It is more useful than...", "Both are good, but..."] },
  { id: 39, name: "Future Dream Sky", enemyId: "email-wyvern", enemy: "Email Wyvern", theme: "将来の夢", requiredWords: 25, isBoss: false, expressions: ["In the future, I want to...", "My dream is...", "I will keep practicing because..."] },
  { id: 40, name: "Grammar Demon Fortress", enemyId: "grammar-demon", enemy: "Grammar Demon", theme: "文法と自然さ", requiredWords: 25, isBoss: true, expressions: ["I have been...", "I would like to...", "The reason is that..."] },
  { id: 41, name: "Long Talk Road", enemyId: "debate-knight", enemy: "Debate Knight", theme: "長めに話す", requiredWords: 26, isBoss: false, expressions: ["First...", "Also...", "Finally..."] },
  { id: 42, name: "Emotion Lake", enemyId: "question-ghost", enemy: "Question Ghost", theme: "感情を伝える", requiredWords: 27, isBoss: false, expressions: ["I felt ... because...", "It made me happy.", "I was nervous, but..."] },
  { id: 43, name: "Story Cave", enemyId: "grammar-goblin", enemy: "Grammar Goblin", theme: "過去の出来事を話す", requiredWords: 28, isBoss: false, expressions: ["Last week, I...", "At first...", "After that..."] },
  { id: 44, name: "Advice Tower", enemyId: "meeting-golem", enemy: "Meeting Golem", theme: "アドバイスする", requiredWords: 29, isBoss: false, expressions: ["You should...", "If I were you...", "It might help to..."] },
  { id: 45, name: "Conversation Dragon Nest", enemyId: "conversation-dragon", enemy: "Conversation Dragon", theme: "会話継続", requiredWords: 30, isBoss: true, expressions: ["That sounds interesting.", "Can you tell me more?", "I have a similar experience."] },
  { id: 46, name: "Deep Question Gate", enemyId: "debate-knight", enemy: "Debate Knight", theme: "深い質問に答える", requiredWords: 31, isBoss: false, expressions: ["I believe that...", "From my experience...", "This matters because..."] },
  { id: 47, name: "Problem Solving Road", enemyId: "meeting-golem", enemy: "Meeting Golem", theme: "問題解決", requiredWords: 32, isBoss: false, expressions: ["The main problem is...", "One solution is...", "We can improve it by..."] },
  { id: 48, name: "Presentation Hall", enemyId: "email-wyvern", enemy: "Email Wyvern", theme: "プレゼン風に話す", requiredWords: 33, isBoss: false, expressions: ["Today, I will talk about...", "There are three points.", "To conclude..."] },
  { id: 49, name: "Final Review Castle", enemyId: "grammar-demon", enemy: "Grammar Demon", theme: "総復習", requiredWords: 34, isBoss: false, expressions: ["In my opinion...", "For example...", "I learned that..."] },
  { id: 50, name: "Dark English Lord Throne", enemyId: "dark-english-lord", enemy: "Dark English Lord", theme: "総合英会話", requiredWords: 35, isBoss: true, expressions: ["I believe...", "For example...", "I feel... because..."] },
];

const rewardEquipment: Record<number, string> = {
  1: "wooden-pencil",
  5: "school-uniform",
  7: "please-ring",
  12: "silver-pen",
  15: "traveler-coat",
  20: "magic-notebook",
  25: "example-charm",
  30: "business-jacket",
  35: "because-amulet",
  40: "grammar-sword",
  45: "dragon-shield",
  48: "confidence-badge",
  50: "conversation-blade",
};

export const stages: Stage[] = seeds.map((stage) => ({
  ...stage,
  mission: `「${stage.theme}」について、${stage.requiredWords}語以上の英語で返答しよう。`,
  hintJa: `${stage.enemy} の質問に、${stage.expressions[0]} のような表現を使って答えてみよう。`,
  recommendedExpressions: stage.expressions,
  reward: {
    exp: Math.round(22 + stage.id * 7 + (stage.isBoss ? stage.id * 3 : 0)),
    gold: Math.round(18 + stage.id * 5 + (stage.isBoss ? 45 : 0)),
    expression: stage.expressions[Math.min(1, stage.expressions.length - 1)],
    equipmentId: rewardEquipment[stage.id],
  },
}));

export const MAX_STAGE_ID = stages.length;

export const getStageById = (stageId: number): Stage => stages[Math.max(0, Math.min(stages.length - 1, stageId - 1))];

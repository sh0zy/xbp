import type { ProcessingResult, Category, ExtractedData } from '../types';

// Simple rule-based text analysis (no external API)
export function analyzeText(text: string): Omit<ProcessingResult, 'ocrText'> {
  const extractedData = extractData(text);
  const category = classifyCategory(text, extractedData);
  const title = generateTitle(text, category);
  const confidence = calculateConfidence(text, extractedData);
  const suggestedTags = generateTags(text, category, extractedData);

  return { category, title, extractedData, confidence, suggestedTags };
}

function extractData(text: string): ExtractedData {
  const lower = text.toLowerCase();

  // Date patterns: YYYY/MM/DD, YYYY-MM-DD, MM/DD, M月D日, etc.
  const datePatterns = [
    /\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/g,
    /\d{1,2}[\/\-\.]\d{1,2}/g,
    /\d{1,2}月\d{1,2}日/g,
    /\d{4}年\d{1,2}月\d{1,2}日/g,
  ];
  const dates: string[] = [];
  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches) dates.push(...matches);
  }

  // Time patterns
  const timePatterns = [
    /\d{1,2}:\d{2}(:\d{2})?/g,
    /\d{1,2}時\d{1,2}分/g,
    /(午前|午後)\d{1,2}時/g,
  ];
  const times: string[] = [];
  for (const pattern of timePatterns) {
    const matches = text.match(pattern);
    if (matches) times.push(...matches);
  }

  // Amount patterns
  const amountPatterns = [
    /¥[\d,]+/g,
    /\$[\d,.]+/g,
    /[\d,]+円/g,
    /[\d,]+yen/gi,
  ];
  const amounts: string[] = [];
  for (const pattern of amountPatterns) {
    const matches = text.match(pattern);
    if (matches) amounts.push(...matches);
  }

  // Code patterns (order numbers, membership IDs, etc.)
  const codePatterns = [
    /[A-Z]{2,}\d{4,}/g,
    /\d{4}[\-\s]\d{4}[\-\s]\d{4}/g,
    /注文番号[:\s]*[\w\-]+/g,
    /会員番号[:\s]*[\w\-]+/g,
    /予約番号[:\s]*[\w\-]+/g,
    /[A-Z0-9]{8,}/g,
  ];
  const codes: string[] = [];
  for (const pattern of codePatterns) {
    const matches = text.match(pattern);
    if (matches) codes.push(...matches);
  }

  // URL patterns
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  const urls = text.match(urlPattern) || [];

  // Keywords
  const keywordList = [
    '期限', '締切', 'deadline', '有効期限', '賞味期限',
    '予約', '注文', '購入', 'イベント', 'チケット',
    'クーポン', '割引', 'セール', 'sale',
    '会員', 'メンバー', 'QR', 'バーコード',
    'レシピ', '材料', '作り方', '手順',
    'メモ', 'TODO', 'やること', '重要',
  ];
  const keywords = keywordList.filter(k => lower.includes(k.toLowerCase()));

  return {
    dates: [...new Set(dates)],
    times: [...new Set(times)],
    amounts: [...new Set(amounts)],
    codes: [...new Set(codes)],
    urls: [...new Set(urls)],
    keywords: [...new Set(keywords)],
  };
}

function classifyCategory(text: string, data: ExtractedData): Category {
  const lower = text.toLowerCase();

  // Event / Ticket
  const eventKeywords = ['チケット', 'ticket', 'イベント', 'event', 'コンサート', 'concert', 'ライブ', 'live', '公演', '開場', '開演', '座席', '入場', 'フェス', '映画', '上映'];
  if (eventKeywords.some(k => lower.includes(k))) return 'event_ticket';

  // Order / Receipt
  const orderKeywords = ['注文', 'order', '購入', '領収', 'receipt', '配送', '配達', '発送', 'お届け', '合計', '小計', '税込', '支払', 'payment', 'amazon', '楽天', 'メルカリ'];
  if (orderKeywords.some(k => lower.includes(k))) return 'order_receipt';
  if (data.amounts.length >= 2) return 'order_receipt';

  // Membership / QR / Code
  const memberKeywords = ['会員', 'member', 'ポイント', 'point', 'カード', 'card', 'QR', 'バーコード', 'barcode', '会員証', 'クーポン', 'coupon', '割引', 'discount'];
  if (memberKeywords.some(k => lower.includes(k))) return 'membership_code';
  if (data.codes.length >= 2) return 'membership_code';

  // Recipe / Food
  const recipeKeywords = ['レシピ', 'recipe', '材料', 'ingredient', '作り方', '手順', 'step', '大さじ', '小さじ', 'カロリー', 'kcal', '分量', '調理', '下ごしらえ'];
  if (recipeKeywords.some(k => lower.includes(k))) return 'recipe_food';

  // Memo / Note
  const memoKeywords = ['メモ', 'memo', 'note', 'TODO', 'やること', 'リスト', 'list', '覚え', '確認', '重要', 'important'];
  if (memoKeywords.some(k => lower.includes(k))) return 'memo_note';

  return 'other';
}

function generateTitle(text: string, category: Category): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return getCategoryLabel(category);

  // Use first meaningful line as title
  let title = lines[0].trim();
  if (title.length > 40) title = title.substring(0, 37) + '...';
  if (title.length < 2) title = lines.length > 1 ? lines[1].trim().substring(0, 40) : getCategoryLabel(category);

  return title;
}

function calculateConfidence(text: string, data: ExtractedData): number {
  if (!text || text.trim().length === 0) return 0;
  let score = 0.3; // base
  if (text.length > 20) score += 0.1;
  if (text.length > 100) score += 0.1;
  if (data.dates.length > 0) score += 0.1;
  if (data.amounts.length > 0) score += 0.1;
  if (data.codes.length > 0) score += 0.1;
  if (data.keywords.length > 0) score += 0.1;
  if (data.urls.length > 0) score += 0.05;
  return Math.min(score, 1);
}

function generateTags(text: string, category: Category, data: ExtractedData): string[] {
  const tags: string[] = [];
  if (data.dates.length > 0) tags.push('日付あり');
  if (data.amounts.length > 0) tags.push('金額あり');
  if (data.codes.length > 0) tags.push('コードあり');
  if (data.urls.length > 0) tags.push('URLあり');
  if (data.keywords.includes('期限') || data.keywords.includes('締切') || data.keywords.includes('deadline')) {
    tags.push('期限あり');
  }
  return tags;
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    event_ticket: 'Event / Ticket',
    order_receipt: 'Order / Receipt',
    membership_code: 'Membership / Code',
    recipe_food: 'Recipe / Food',
    memo_note: 'Memo / Note',
    other: 'Other',
  };
  return labels[category];
}

export function getCategoryIcon(category: Category): string {
  const icons: Record<Category, string> = {
    event_ticket: 'ticket',
    order_receipt: 'receipt',
    membership_code: 'qr-code',
    recipe_food: 'chef-hat',
    memo_note: 'sticky-note',
    other: 'file',
  };
  return icons[category];
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    inbox: '未整理',
    needs_action: '要対応',
    saved: '保存済み',
    completed: '完了',
    archived: 'アーカイブ',
  };
  return labels[status] || status;
}

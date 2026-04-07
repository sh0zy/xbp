import { v4 as uuidv4 } from 'uuid';
import type { ScreenshotItem } from '../types';

export function generateSampleData(): ScreenshotItem[] {
  const now = new Date();
  const items: ScreenshotItem[] = [
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      imageData: createSampleImage('#6366F1', 'SUMMER FEST 2026'),
      thumbnailData: createSampleImage('#6366F1', 'SUMMER FEST'),
      ocrText: 'SUMMER FEST 2026\n日時: 2026/08/15 開場 14:00\n会場: 東京ドーム\nチケット番号: TK-2026-0815-A123\n座席: Aブロック 15列 28番\n入場料: ¥8,500',
      category: 'event_ticket',
      status: 'needs_action',
      title: 'SUMMER FEST 2026',
      note: '',
      extractedData: {
        dates: ['2026/08/15'],
        times: ['14:00'],
        amounts: ['¥8,500'],
        codes: ['TK-2026-0815-A123'],
        urls: [],
        keywords: ['チケット', 'イベント'],
      },
      reminders: [{
        id: uuidv4(),
        date: new Date(now.getTime() + 5 * 86400000).toISOString(),
        note: 'イベント前日確認',
        completed: false,
      }],
      completedAt: null,
      archivedAt: null,
      tags: ['日付あり', '金額あり', 'コードあり'],
      sourceType: 'sample',
      confidence: 0.9,
      isFavorite: true,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      imageData: createSampleImage('#F97316', 'Amazon 注文確認'),
      thumbnailData: createSampleImage('#F97316', 'Amazon'),
      ocrText: 'Amazon.co.jp 注文確認\n注文番号: 503-1234567-8901234\nお届け予定日: 2026/04/12\n商品: ワイヤレスイヤホン Pro\n数量: 1\n合計: ¥12,800\n支払方法: クレジットカード',
      category: 'order_receipt',
      status: 'needs_action',
      title: 'Amazon 注文 - ワイヤレスイヤホン',
      note: '',
      extractedData: {
        dates: ['2026/04/12'],
        times: [],
        amounts: ['¥12,800'],
        codes: ['503-1234567-8901234'],
        urls: [],
        keywords: ['注文', '購入'],
      },
      reminders: [],
      completedAt: null,
      archivedAt: null,
      tags: ['日付あり', '金額あり', 'コードあり'],
      sourceType: 'sample',
      confidence: 0.85,
      isFavorite: false,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      imageData: createSampleImage('#22C55E', 'スタバ リワード'),
      thumbnailData: createSampleImage('#22C55E', 'Starbucks'),
      ocrText: 'スターバックス リワード\n会員番号: 4532-8901-2345\nポイント残高: 250 Star\nゴールド会員\nクーポン: ドリンク1杯無料\n有効期限: 2026/04/30',
      category: 'membership_code',
      status: 'saved',
      title: 'スタバ 会員証',
      note: 'ドリンク無料クーポンあり',
      extractedData: {
        dates: ['2026/04/30'],
        times: [],
        amounts: [],
        codes: ['4532-8901-2345'],
        urls: [],
        keywords: ['会員', 'ポイント', 'クーポン', '有効期限'],
      },
      reminders: [{
        id: uuidv4(),
        date: new Date(now.getTime() + 20 * 86400000).toISOString(),
        note: 'クーポン期限が近い',
        completed: false,
      }],
      completedAt: null,
      archivedAt: null,
      tags: ['日付あり', 'コードあり', '期限あり'],
      sourceType: 'sample',
      confidence: 0.88,
      isFavorite: true,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      imageData: createSampleImage('#EAB308', '鶏肉のトマト煮'),
      thumbnailData: createSampleImage('#EAB308', 'Recipe'),
      ocrText: '鶏肉のトマト煮込み\n材料 (2人分)\n鶏もも肉 300g\nトマト缶 1缶\n玉ねぎ 1個\nにんにく 2片\nオリーブオイル 大さじ2\n塩こしょう 適量\n作り方\n1. 鶏肉を一口大に切る\n2. 玉ねぎとにんにくをみじん切り\n3. オリーブオイルで炒める\n4. トマト缶を入れて20分煮込む',
      category: 'recipe_food',
      status: 'saved',
      title: '鶏肉のトマト煮込み',
      note: '簡単で美味しい',
      extractedData: {
        dates: [],
        times: [],
        amounts: [],
        codes: [],
        urls: [],
        keywords: ['レシピ', '材料', '作り方', '大さじ'],
      },
      reminders: [],
      completedAt: null,
      archivedAt: null,
      tags: [],
      sourceType: 'sample',
      confidence: 0.92,
      isFavorite: true,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
      imageData: createSampleImage('#8B5CF6', 'TODO メモ'),
      thumbnailData: createSampleImage('#8B5CF6', 'Memo'),
      ocrText: 'やることリスト\n□ レポート提出 (4/10まで)\n□ 歯医者予約\n□ プレゼン資料作成\n□ 本を返却する\n重要: 奨学金の書類 締切4/15',
      category: 'memo_note',
      status: 'inbox',
      title: 'やることリスト',
      note: '',
      extractedData: {
        dates: ['4/10', '4/15'],
        times: [],
        amounts: [],
        codes: [],
        urls: [],
        keywords: ['メモ', 'TODO', 'やること', '締切', '重要'],
      },
      reminders: [],
      completedAt: null,
      archivedAt: null,
      tags: ['日付あり', '期限あり'],
      sourceType: 'sample',
      confidence: 0.8,
      isFavorite: false,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      imageData: createSampleImage('#EC4899', 'セール情報'),
      thumbnailData: createSampleImage('#EC4899', 'Sale'),
      ocrText: 'SPRING SALE\n期間: 2026/04/01 - 2026/04/20\n全品 30% OFF\nクーポンコード: SPRING2026\nオンラインストア限定\nhttps://example-shop.com/sale',
      category: 'membership_code',
      status: 'needs_action',
      title: 'SPRING SALE 30% OFF',
      note: '',
      extractedData: {
        dates: ['2026/04/01', '2026/04/20'],
        times: [],
        amounts: [],
        codes: ['SPRING2026'],
        urls: ['https://example-shop.com/sale'],
        keywords: ['クーポン', '割引', 'セール', '期限'],
      },
      reminders: [],
      completedAt: null,
      archivedAt: null,
      tags: ['日付あり', 'コードあり', 'URLあり', '期限あり'],
      sourceType: 'sample',
      confidence: 0.85,
      isFavorite: false,
    },
    {
      id: uuidv4(),
      createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      importedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      imageData: createSampleImage('#14B8A6', '完了済み注文'),
      thumbnailData: createSampleImage('#14B8A6', 'Done'),
      ocrText: '楽天市場 注文完了\n注文番号: R-20260325-001\n商品: USB-C ケーブル 3本セット\n合計: ¥1,280\nお届け完了',
      category: 'order_receipt',
      status: 'completed',
      title: '楽天 - USB-Cケーブル',
      note: '届いた',
      extractedData: {
        dates: [],
        times: [],
        amounts: ['¥1,280'],
        codes: ['R-20260325-001'],
        urls: [],
        keywords: ['注文'],
      },
      reminders: [],
      completedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      archivedAt: null,
      tags: ['金額あり', 'コードあり'],
      sourceType: 'sample',
      confidence: 0.82,
      isFavorite: false,
    },
  ];

  return items;
}

function createSampleImage(color: string, text: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 300, 400);

  // Header bar
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 300, 80);

  // Title text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 150, 48);

  // Content lines
  ctx.fillStyle = '#e2e8f0';
  for (let i = 0; i < 6; i++) {
    const width = 120 + Math.random() * 140;
    ctx.fillRect(30, 110 + i * 40, width, 12);
  }

  // Small accent
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(20, 350, 260, 30);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/jpeg', 0.6);
}

/** 新入生向け・サークル紹介のモックデータ */
import type { Circle } from '@/types/community';

export const seedCircles: Circle[] = [
  {
    id: 'c-001', name: 'テニスサークル KUT', genre: 'スポーツ', campus: '横浜',
    description: '週2回・初心者歓迎! 神大のインカレサークル。新歓試合あり。',
    activityDays: ['火', '金'], memberCount: 80, welcomingFreshmen: true,
  },
  {
    id: 'c-002', name: '軽音部 HARMONIZE', genre: '音楽', campus: '横浜',
    description: 'ロック・ポップス・ジャズなんでも。年2回ライブ開催。',
    activityDays: ['水', '土'], memberCount: 45, welcomingFreshmen: true,
  },
  {
    id: 'c-003', name: 'プロコン研究会', genre: '学術', campus: 'みなとみらい',
    description: '競プロ・ハッカソン出場を目指す技術サークル。初心者講習あり。',
    activityDays: ['月', '木'], memberCount: 30, welcomingFreshmen: true,
  },
  {
    id: 'c-004', name: '国際交流サークル WAVE', genre: '国際', campus: 'みなとみらい',
    description: '留学生と日本人が英語・日本語で交流。毎週イベント開催。',
    activityDays: ['水'], memberCount: 60, welcomingFreshmen: true,
  },
  {
    id: 'c-005', name: '写真部', genre: '文化', campus: '横浜',
    description: '月1撮影会・年1回写真展。初心者・機材なしでもOK。',
    activityDays: ['土'], memberCount: 25, welcomingFreshmen: true,
  },
  {
    id: 'c-006', name: 'ボランティアサークル つなぐ', genre: 'ボランティア', campus: '横浜',
    description: '地域清掃・子ども食堂など。スポット参加可。',
    activityDays: ['日'], memberCount: 40, welcomingFreshmen: true,
  },
  {
    id: 'c-007', name: 'ダンスサークル VIBES', genre: '文化', campus: 'みなとみらい',
    description: 'HIPHOP・K-POP・GIRLS。経験不問、文化祭メインステージ出演。',
    activityDays: ['月', '木', '土'], memberCount: 70, welcomingFreshmen: true,
  },
  {
    id: 'c-008', name: '映画研究会', genre: '文化', campus: '横浜',
    description: '月1映画鑑賞会 + 年1自主制作。シナリオ・撮影・編集を学ぶ。',
    activityDays: ['金'], memberCount: 20, welcomingFreshmen: true,
  },
];

export const seedTopics = [
  {
    id: 't-001', category: '履修', title: '1年前期の楽単おすすめは?',
    body: '共通教養で取りやすい授業を教えて欲しいです。レポート中心だと嬉しいです。',
    replies: 12,
  },
  {
    id: 't-002', category: 'キャンパス', title: 'みなとみらいキャンパスの学食レビュー',
    body: '11階のカフェテリア、景色すごく良いです。おすすめメニューありますか?',
    replies: 8,
  },
  {
    id: 't-003', category: '新歓', title: 'テニスサークルの新歓行った人感想教えて',
    body: '初心者でも入りやすい雰囲気でしたか?',
    replies: 5,
  },
  {
    id: 't-004', category: '履修', title: '英語クラス分けテストの勉強法',
    body: 'TOEIC形式と聞きましたが、どのくらい対策すれば良い?',
    replies: 15,
  },
  {
    id: 't-005', category: 'キャンパス', title: '横浜キャンパスのWi-Fi速い場所',
    body: '図書館以外で集中できるスポット募集!',
    replies: 3,
  },
];

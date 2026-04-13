/** 新入生向け・交流機能のモック (友達候補) */
import type { Friend } from '@/types/community';

export const seedFriends: Friend[] = [
  {
    id: 'fr-001', userId: 'u-001', displayName: 'あおい', handle: '@aoi25',
    grade: 1, faculty: '経営学部', campus: 'みなとみらい',
    tags: ['簿記', 'カフェ巡り', '映画'], comment: '新入生です! 履修相談ゆるく募集中',
    isFriend: false, isSuggested: true,
  },
  {
    id: 'fr-002', userId: 'u-002', displayName: 'ゆう', handle: '@yu_jp25',
    grade: 1, faculty: '国際日本学部', campus: 'みなとみらい',
    tags: ['英会話', 'K-POP', '旅行'], comment: '同じ学部の人と繋がりたい!',
    isFriend: false, isSuggested: true,
  },
  {
    id: 'fr-003', userId: 'u-003', displayName: 'たける', handle: '@take_cs',
    grade: 1, faculty: '情報学部', campus: '横浜',
    tags: ['プログラミング', 'ゲーム', 'AI'], comment: 'プロ入門の情報交換したいです',
    isFriend: false, isSuggested: true,
  },
  {
    id: 'fr-004', userId: 'u-004', displayName: 'りな', handle: '@rina_law',
    grade: 1, faculty: '法学部', campus: '横浜',
    tags: ['読書', 'ラテアート', 'カラオケ'], comment: '法学入門の楽単情報求む',
    isFriend: false, isSuggested: true,
  },
  {
    id: 'fr-005', userId: 'u-005', displayName: 'しょう', handle: '@sho_arch',
    grade: 1, faculty: '建築学部', campus: 'みなとみらい',
    tags: ['建築', '写真', 'サイクリング'], comment: '建築サークル入りたい人いる?',
    isFriend: false, isSuggested: true,
  },
  {
    id: 'fr-006', userId: 'u-006', displayName: 'みお', handle: '@mio_eng',
    grade: 1, faculty: '外国語学部', campus: '横浜',
    tags: ['英語', '留学', 'カフェ'], comment: '留学考えてる人と話したい',
    isFriend: false, isSuggested: false,
  },
  {
    id: 'fr-007', userId: 'u-007', displayName: 'けん', handle: '@ken_eco',
    grade: 1, faculty: '経済学部', campus: '横浜',
    tags: ['投資', 'サッカー', '筋トレ'], comment: '同じ学部の友達募集中',
    isFriend: false, isSuggested: false,
  },
  {
    id: 'fr-008', userId: 'u-008', displayName: 'さくら', handle: '@sakura_psy',
    grade: 1, faculty: '人間科学部', campus: '横浜',
    tags: ['心理学', 'アニメ', 'ピアノ'], comment: 'ゆるく繋がれたら嬉しいです',
    isFriend: false, isSuggested: false,
  },
];

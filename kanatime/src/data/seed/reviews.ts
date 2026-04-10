import type { CourseReview } from '@/types';

export const seedReviews: CourseReview[] = [
  { id: 'rev-001', courseId: 'seed-001', workloadScore: 2, examScore: 3, attendanceStrictnessScore: 4, clarityScore: 4, easeScore: 3, satisfactionScore: 4, shortComment: '出席は毎回取ります。テストは論述形式で範囲が広め。', createdAt: '2025-03-15', reportCount: 0, isHidden: false },
  { id: 'rev-002', courseId: 'seed-001', workloadScore: 3, examScore: 3, attendanceStrictnessScore: 4, clarityScore: 3, easeScore: 3, satisfactionScore: 3, shortComment: 'レジュメが分かりやすい。予習すれば問題なし。', createdAt: '2025-03-20', reportCount: 0, isHidden: false },
  { id: 'rev-003', courseId: 'seed-002', workloadScore: 3, examScore: 4, attendanceStrictnessScore: 2, clarityScore: 4, easeScore: 3, satisfactionScore: 4, shortComment: '板書が丁寧。中間と期末の配分が半々。', createdAt: '2025-03-10', reportCount: 0, isHidden: false },
  { id: 'rev-004', courseId: 'seed-003', workloadScore: 2, examScore: 2, attendanceStrictnessScore: 3, clarityScore: 5, easeScore: 4, satisfactionScore: 5, shortComment: 'グループワーク中心で楽しい。プレゼンの練習になる。', createdAt: '2025-03-18', reportCount: 0, isHidden: false },
  { id: 'rev-005', courseId: 'seed-006', workloadScore: 2, examScore: 3, attendanceStrictnessScore: 3, clarityScore: 4, easeScore: 4, satisfactionScore: 4, shortComment: '心理学に興味があれば面白い内容。小テストが毎回ある。', createdAt: '2025-03-22', reportCount: 0, isHidden: false },
  { id: 'rev-006', courseId: 'seed-011', workloadScore: 4, examScore: 3, attendanceStrictnessScore: 5, clarityScore: 4, easeScore: 2, satisfactionScore: 4, shortComment: '毎回課題あり。出席必須。ただし丁寧に教えてくれる。', createdAt: '2025-03-25', reportCount: 0, isHidden: false },
  { id: 'rev-007', courseId: 'seed-011', workloadScore: 4, examScore: 3, attendanceStrictnessScore: 5, clarityScore: 5, easeScore: 3, satisfactionScore: 5, shortComment: 'プログラミング未経験でも大丈夫。TAさんが親切。', createdAt: '2025-03-28', reportCount: 0, isHidden: false },
  { id: 'rev-008', courseId: 'seed-014', workloadScore: 4, examScore: 4, attendanceStrictnessScore: 3, clarityScore: 3, easeScore: 2, satisfactionScore: 3, shortComment: 'アルゴリズムの基礎がしっかり学べる。課題は重め。', createdAt: '2025-03-12', reportCount: 0, isHidden: false },
  { id: 'rev-009', courseId: 'seed-009', workloadScore: 5, examScore: 2, attendanceStrictnessScore: 4, clarityScore: 4, easeScore: 2, satisfactionScore: 4, shortComment: '製図課題が大変だが達成感あり。', createdAt: '2025-03-14', reportCount: 0, isHidden: false },
  { id: 'rev-010', courseId: 'seed-025', workloadScore: 3, examScore: 3, attendanceStrictnessScore: 3, clarityScore: 5, easeScore: 3, satisfactionScore: 5, shortComment: 'AI技術の最新動向も紹介してくれる。将来役立つ。', createdAt: '2025-03-30', reportCount: 0, isHidden: false },
];

import type { ChapterData } from './types';

export const chapters: Record<string, ChapterData> = {
  prologue: {
    id: 'prologue',
    title: 'Prologue',
    subtitle: '23:58、正門前',
    maps: ['gate', 'approach'],
    clearText: '開いているはずのない門を抜けた。出席確認音が、背中の後ろで鳴った。',
  },
  chapter1: {
    id: 'chapter1',
    title: 'Chapter 1',
    subtitle: '本日の欠席者',
    maps: ['building1_hall', 'lecture_a', 'pc_room', 'stairs_1', 'library_entrance'],
    clearText: 'スマホに通知が届く。「出席確認が完了しました」。差出人は空欄だった。',
  },
  chapter2: {
    id: 'chapter2',
    title: 'Chapter 2',
    subtitle: '返却されない本',
    maps: ['library_lobby', 'stacks', 'reading_area', 'return_post', 'basement_entrance'],
    clearText: '地下資料室の鍵を手に入れた。鍵には、あなたの学生番号が刻まれている。',
  },
  chapter3: {
    id: 'chapter3',
    title: 'Chapter 3',
    subtitle: '消された記録',
    maps: ['affairs_front', 'office', 'archive_room', 'camera_room', 'staff_corridor'],
    clearText: '失踪した学生は、あなたと同じゼミにいた。記録はそれを隠そうとしている。',
  },
  chapter4: {
    id: 'chapter4',
    title: 'Chapter 4',
    subtitle: '欠席者の名前',
    maps: ['basement_corridor', 'record_storage', 'old_board', 'blackout_archive', 'emergency_stairs'],
    clearText: '名前はもう少しで戻る。だが、見ていたことも同時に戻ってくる。',
  },
  final: {
    id: 'final',
    title: 'Final',
    subtitle: '23:58の教室',
    maps: ['rooftop_front', 'rooftop', 'classroom_2358', 'record_corridor'],
    clearText: '最後の出席確認が始まる。',
  },
};

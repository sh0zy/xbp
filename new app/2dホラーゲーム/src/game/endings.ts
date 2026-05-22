import type { EndingData } from './types';

export const endings: Record<EndingData['id'], EndingData> = {
  endingA: {
    id: 'endingA',
    title: 'Ending A',
    subtitle: '帰宅',
    body: [
      'あなたは大学から出られた。',
      '翌朝、掲示板には新しい紙が貼られていた。',
      '本日の欠席者：2名',
    ],
  },
  endingB: {
    id: 'endingB',
    title: 'Ending B',
    subtitle: '再出席',
    body: [
      '名前を間違えた瞬間、教室の机がひとつ増えた。',
      '学生証の写真が黒く塗られ、セーブデータ名が「042」に変わる。',
      '次の出席確認音は、あなたの内側から鳴った。',
    ],
  },
  endingC: {
    id: 'endingC',
    title: 'Ending C',
    subtitle: '欠席者の名前',
    body: [
      '榊ユウ。',
      '名前を呼ぶと、黒い影の輪郭からノイズが抜け落ちた。',
      'あなたは見て見ぬふりをした夜を思い出す。23:58の時計が、23:59へ進む。',
      '大学の夜が終わる。',
    ],
  },
};

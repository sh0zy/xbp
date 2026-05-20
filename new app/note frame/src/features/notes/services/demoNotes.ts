import type { Note } from '@/features/notes/types/note';

interface DemoSeed {
  title: string;
  content: string;
  color: Note['color'];
  isPinned?: boolean;
  isFavorite?: boolean;
  hoursAgo: number;
}

const DEMO_SEEDS: DemoSeed[] = [
  {
    title: '静かな朝にやること',
    content:
      '白湯を飲む。カーテンを開ける。10分だけ机を整える。朝のメモは、予定よりも気分を整えるために使う。',
    color: 'indigo',
    isPinned: true,
    isFavorite: true,
    hoursAgo: 2,
  },
  {
    title: '買い物リスト / 今夜の献立',
    content:
      'トマト、モッツァレラ、オリーブオイル、ルッコラ。ついでに無糖ヨーグルトと炭酸水も忘れない。',
    color: 'amber',
    hoursAgo: 6,
  },
  {
    title: '企画メモ: NoteFrameの見せ方',
    content:
      '機能説明よりも、最初の1画面で世界観を伝える。余白を広く取り、カードの温度感で完成度を出す。',
    color: 'rose',
    isPinned: true,
    hoursAgo: 9,
  },
  {
    title: '旅行で撮りたい景色',
    content:
      '夕方の港、朝焼けの路地、雨上がりの石畳。写真は派手さよりも空気が残る瞬間を優先したい。',
    color: 'slate',
    isFavorite: true,
    hoursAgo: 17,
  },
  {
    title: '読書メモ: 余白のデザイン',
    content:
      '詰め込まない設計は、それだけで信頼感になる。情報量ではなく、選び抜いた配置が体験を静かに強くする。',
    color: 'emerald',
    hoursAgo: 26,
  },
  {
    title: '学習ログ: TypeScript strict',
    content:
      'union type を先に設計すると、UIの条件分岐まで自然に整理される。保存処理は防御的に、表示処理は明示的に。',
    color: 'indigo',
    isFavorite: true,
    hoursAgo: 30,
  },
  {
    title: '部屋を整える小さなTODO',
    content:
      'ベッド脇の本を戻す。使っていない充電器をまとめる。夜の視界にノイズが少ないと眠る前の気持ちも軽くなる。',
    color: 'slate',
    hoursAgo: 40,
  },
  {
    title: '週末に試したいレシピ',
    content:
      'バターを控えめにしたきのこのリゾット。仕上げに黒胡椒を少しだけ強めに振る。',
    color: 'amber',
    hoursAgo: 52,
  },
];

function createNoteId(index: number): string {
  return `demo-note-${index + 1}`;
}

export function createDemoNotes(referenceDate: Date = new Date()): Note[] {
  return DEMO_SEEDS.map((seed, index) => {
    const timestamp = new Date(referenceDate.getTime() - seed.hoursAgo * 60 * 60 * 1000).toISOString();

    return {
      id: createNoteId(index),
      title: seed.title,
      content: seed.content,
      color: seed.color,
      isPinned: seed.isPinned ?? false,
      isFavorite: seed.isFavorite ?? false,
      isArchived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

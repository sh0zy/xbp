import { chapters } from '../game/chapters';
import type { ChapterData } from '../game/types';

interface ChapterClearScreenProps {
  chapter: ChapterData;
  logCount: number;
  puzzleCount: number;
  onNext: () => void;
}

const fragmentByChapter: Record<string, string> = {
  prologue: '欠席者：廊下奥の影だけが解放された。',
  chapter1: '榊ユウ：名前の消えた学生証の断片。',
  chapter2: '図書館職員：貸出記録映像の断片。',
  chapter3: '学生課職員の影：巡回記録の断片。',
  chapter4: '榊ユウ：破れた写真がほぼ復元された。',
  final: '欠席者：名前を待つ残響。',
};

export function ChapterClearScreen({ chapter, logCount, puzzleCount, onNext }: ChapterClearScreenProps) {
  return (
    <section className="chapter-clear screen-fade">
      <div className="chapter-clear-card">
        <p className="clear-kicker">{chapter.title}</p>
        <h2>{chapter.subtitle}</h2>
        <p>{chapter.clearText}</p>
        <div className="clear-stats">
          <span>収集ログ {logCount}</span>
          <span>解決謎解き {puzzleCount}</span>
        </div>
        <p className="character-fragment">{fragmentByChapter[chapter.id] ?? chapters.final.clearText}</p>
        <button type="button" onClick={onNext}>次へ</button>
      </div>
    </section>
  );
}

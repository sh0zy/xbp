import { ENDING_SUMMARIES } from "../game/content";
import { APP_NAME } from "../game/constants";
import type { EndingType } from "../game/types";

type TitleScreenProps = {
  hasSave: boolean;
  seenEndings: EndingType[];
  onNewGame: () => void;
  onContinue: () => void;
};

export const TitleScreen = ({
  hasSave,
  seenEndings,
  onNewGame,
  onContinue
}: TitleScreenProps) => (
  <main className="title-screen">
    <section className="title-card">
      <p className="eyebrow">Portrait Horror RPG</p>
      <h1>{APP_NAME}</h1>
      <p className="title-copy">
        月ヶ瀬診療棟に残された黒帳簿を閉じる、15〜30分の縦画面短編ホラー。
        上で探索し、下で読む。片手でも最後まで進める設計です。
      </p>
      <div className="title-actions">
        <button className="primary-button" onClick={onNewGame}>
          ニューゲーム
        </button>
        <button className="ghost-button" onClick={onContinue} disabled={!hasSave}>
          続きから
        </button>
      </div>
      <div className="title-notes">
        <p>操作: 左下で移動 / 右下で調べる / 右上でメニュー</p>
        <p>PC補助: WASD・矢印 / Enter・Space / Esc</p>
      </div>
    </section>

    <section className="title-card title-card--thin">
      <p className="eyebrow">記録済みエンド</p>
      {seenEndings.length > 0 ? (
        <div className="ending-ribbons">
          {seenEndings.map((ending) => (
            <span key={ending} className="ending-ribbon">
              {ENDING_SUMMARIES[ending].ribbon}
            </span>
          ))}
        </div>
      ) : (
        <p className="title-copy title-copy--muted">まだ何も閉じられていない。</p>
      )}
    </section>
  </main>
);

import type { SaveSlotSummary } from '../game/types';
import { chapters } from '../game/chapters';
import { formatTime } from '../utils/random';

interface SaveSelectScreenProps {
  summaries: SaveSlotSummary[];
  onLoad: (slot: number) => void;
  onNew: (slot: number) => void;
  onDelete: (slot: number) => void;
  onBack: () => void;
}

function formatDate(value?: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function SaveSelectScreen({ summaries, onLoad, onNew, onDelete, onBack }: SaveSelectScreenProps) {
  return (
    <section className="menu-screen save-select screen-fade">
      <header className="screen-header">
        <button type="button" onClick={onBack} aria-label="戻る">← CLOSE</button>
        <h2>セーブ選択</h2>
      </header>
      <div className="save-slots">
        {summaries.map((slot) => {
          const endingB = slot.label === '042' || slot.clearedEndings?.includes('endingB');
          const endingC = slot.clearedEndings?.includes('endingC');
          return (
            <article key={slot.slot} className={`save-card ${slot.isEmpty ? 'is-empty' : ''} ${endingB ? 'ending-b' : ''} ${endingC ? 'ending-c' : ''}`}>
              <div className="save-slot-label">[ SLOT {slot.slot} ]</div>
              {slot.isEmpty ? (
                <>
                  <h3>--- EMPTY ---</h3>
                  <p>新しい出席記録を作成する。</p>
                  <button type="button" onClick={() => onNew(slot.slot)} aria-label={`スロット${slot.slot}で新規開始`}>新規開始</button>
                </>
              ) : (
                <>
                  <h3>{slot.label ?? `${chapters[slot.chapter ?? 'prologue'].title} — ${slot.mapName}`}</h3>
                  <p>{formatDate(slot.updatedAt)}　プレイ時間 {formatTime(slot.playTimeSeconds ?? 0)}</p>
                  <p>ログ収集：{slot.logCount ?? 0}/20　重要：{slot.importantCount ?? 0}/8</p>
                  <div className="save-card-actions">
                    <button type="button" onClick={() => onLoad(slot.slot)} aria-label={`スロット${slot.slot}をロード`}>このデータから始める</button>
                    <button type="button" onClick={() => onDelete(slot.slot)} aria-label={`スロット${slot.slot}を削除`}>削除</button>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

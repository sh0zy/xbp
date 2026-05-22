import { useEffect, useMemo, useState } from 'react';
import { logs } from '../game/logs';
import type { ChapterId, SaveData } from '../game/types';

interface LogScreenProps {
  saveData: SaveData;
  onClose: () => void;
  onMarkRead: (logId: string) => void;
}

type Filter = 'all' | 'important' | ChapterId;

const chapterFilters: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'すべて' },
  { id: 'important', label: '重要' },
  { id: 'prologue', label: 'Prologue' },
  { id: 'chapter1', label: 'Chapter 1' },
  { id: 'chapter2', label: 'Chapter 2' },
  { id: 'chapter3', label: 'Chapter 3' },
  { id: 'chapter4', label: 'Chapter 4' },
  { id: 'final', label: 'Final' },
];

export function LogScreen({ saveData, onClose, onMarkRead }: LogScreenProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string>(() => saveData.collectedLogs[0] ?? '');

  const collected = useMemo(() => {
    return saveData.collectedLogs
      .map((id) => logs[id])
      .filter(Boolean)
      .filter((log) => {
        if (filter === 'all') {
          return true;
        }
        if (filter === 'important') {
          return log.isImportant;
        }
        return log.chapter === filter;
      });
  }, [filter, saveData.collectedLogs]);

  const selected = logs[selectedId] ?? collected[0];

  useEffect(() => {
    if (selected?.id) {
      onMarkRead(selected.id);
    }
  }, [onMarkRead, selected?.id]);

  return (
    <section className="menu-screen log-screen screen-fade">
      <header className="screen-header">
        <button type="button" onClick={onClose} aria-label="閉じる">← CLOSE</button>
        <h2>記録</h2>
      </header>
      <div className="log-tabs" role="tablist" aria-label="ログフィルター">
        {chapterFilters.map((item) => (
          <button key={item.id} type="button" className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>{item.label}</button>
        ))}
      </div>
      <div className="log-layout">
        <div className="log-list" role="list">
          {collected.length === 0 ? <p className="empty-note">まだ記録がない。</p> : null}
          {collected.map((log) => {
            const unread = !saveData.readLogs.includes(log.id);
            return (
              <button key={log.id} type="button" className={`${selected?.id === log.id ? 'active' : ''} ${unread ? 'unread' : ''}`} onClick={() => setSelectedId(log.id)}>
                <span>{unread ? '▶' : ' '}</span>
                {unread ? <b>[NEW]</b> : null}
                {log.isImportant ? <em>[!]</em> : null}
                {log.title}
              </button>
            );
          })}
        </div>
        <article className="log-detail">
          {selected ? (
            <>
              <h3>{selected.title}</h3>
              <p className="log-meta">Chapter: {selected.chapter} / Puzzle: {selected.relatedPuzzleId ?? 'none'}</p>
              <p>{selected.body}</p>
              <p className="log-date">発見：{saveData.logDiscoveredAt[selected.id] ? new Date(saveData.logDiscoveredAt[selected.id]).toLocaleString('ja-JP') : '不明'}</p>
            </>
          ) : (
            <p>左の記録を選択。</p>
          )}
        </article>
      </div>
    </section>
  );
}

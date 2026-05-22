import { useMemo, useState } from 'react';
import { items } from '../game/items';
import type { SaveData } from '../game/types';

interface InventoryScreenProps {
  saveData: SaveData;
  onClose: () => void;
}

function ItemIcon({ icon }: { icon: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="3" fill="var(--color-bg-overlay)" stroke="var(--color-border)" />
      {icon === 'key' ? <path d="M14 28 H28 M28 28 A7 7 0 1 0 28 18 A7 7 0 0 0 28 28 M18 28 V33 M22 28 V32" stroke="var(--color-log-ink)" strokeWidth="2" fill="none" /> : null}
      {icon === 'id' ? <><rect x="13" y="14" width="22" height="20" rx="2" fill="var(--color-log-paper)" /><circle cx="21" cy="22" r="4" fill="var(--color-text-muted)" /><path d="M27 20 H33 M27 25 H33 M16 31 H32" stroke="var(--color-bg-deep)" /></> : null}
      {icon === 'flashlight' ? <><path d="M14 26 L29 20 L34 29 L19 35 Z" fill="var(--color-accent-blue)" /><path d="M30 20 L40 12 L42 16 L34 29 Z" fill="var(--color-accent-glow)" opacity="0.45" /></> : null}
      {icon === 'photo' ? <><rect x="12" y="12" width="24" height="28" fill="var(--color-log-paper)" stroke="var(--color-border)" /><path d="M14 30 L22 23 L29 31 L35 24" stroke="var(--color-text-muted)" fill="none" /><path d="M24 12 L21 40" stroke="var(--color-danger)" /></> : null}
      {icon === 'camera' ? <><rect x="12" y="17" width="24" height="18" rx="3" fill="var(--color-accent-blue)" /><circle cx="24" cy="26" r="6" fill="var(--color-bg-deep)" stroke="var(--color-log-ink)" /></> : null}
      {icon === 'ticket' ? <><path d="M13 16 H35 V34 H13 Z" fill="var(--color-log-paper)" /><path d="M18 21 H30 M18 26 H32 M18 31 H26" stroke="var(--color-bg-deep)" /></> : null}
      {icon === 'note' || icon === 'card' ? <><rect x="13" y="13" width="22" height="26" rx="2" fill="var(--color-log-paper)" /><path d="M18 20 H31 M18 25 H30 M18 30 H27" stroke="var(--color-bg-deep)" /></> : null}
    </svg>
  );
}

export function InventoryScreen({ saveData, onClose }: InventoryScreenProps) {
  const obtained = useMemo(() => saveData.inventory.map((id) => items[id]).filter(Boolean), [saveData.inventory]);
  const [selectedId, setSelectedId] = useState(() => obtained[0]?.id ?? '');
  const selected = items[selectedId] ?? obtained[0];

  return (
    <section className="menu-screen inventory-screen screen-fade">
      <header className="screen-header">
        <button type="button" onClick={onClose} aria-label="閉じる">← CLOSE</button>
        <h2>持ち物</h2>
      </header>
      <div className="inventory-grid">
        {Array.from({ length: Math.max(12, obtained.length) }, (_, index) => {
          const item = obtained[index];
          if (!item) {
            return <div key={`empty-${index}`} className="item-card empty" />;
          }
          return (
            <button key={item.id} type="button" className={`item-card ${selected?.id === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
              {item.isImportant ? <span className="important-mark">!</span> : null}
              <ItemIcon icon={item.icon} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
      <article className="item-detail">
        {selected ? (
          <>
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            <p>取得場所：{selected.obtainLocation}</p>
            <p>取得：{saveData.itemObtainedAt[selected.id] ? new Date(saveData.itemObtainedAt[selected.id]).toLocaleString('ja-JP') : '不明'}</p>
          </>
        ) : (
          <p>まだ何も持っていない。</p>
        )}
      </article>
    </section>
  );
}

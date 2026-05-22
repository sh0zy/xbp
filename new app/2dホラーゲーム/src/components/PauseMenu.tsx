interface PauseMenuProps {
  onResume: () => void;
  onLogs: () => void;
  onInventory: () => void;
  onSettings: () => void;
  onSave: () => void;
  onTitle: () => void;
}

export function PauseMenu({ onResume, onLogs, onInventory, onSettings, onSave, onTitle }: PauseMenuProps) {
  return (
    <section className="pause-menu screen-fade" role="dialog" aria-modal="true" aria-label="ポーズメニュー">
      <nav>
        <button type="button" onClick={onResume}>再開</button>
        <button type="button" onClick={onLogs}>ログを見る</button>
        <button type="button" onClick={onInventory}>アイテムを見る</button>
        <button type="button" onClick={onSettings}>設定</button>
        <button type="button" onClick={onSave}>セーブ</button>
        <button type="button" className="muted" onClick={onTitle}>タイトルへ戻る</button>
      </nav>
    </section>
  );
}

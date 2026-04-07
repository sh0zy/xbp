import { formatPlayTime, getCurrentMap } from "../game/engine";
import type {
  DialogueEntry,
  Direction,
  GameState,
  Item,
  JournalEntry,
  MapObject
} from "../game/types";
import type { ViewportCell } from "../game/engine";

type GameShellProps = {
  state: GameState;
  viewport: ViewportCell[];
  dialogue: DialogueEntry | null;
  areaText: string;
  actionLabel: string;
  actionTarget: MapObject | null;
  inventoryItems: Item[];
  journalEntries: JournalEntry[];
  hasSave: boolean;
  onMove: (direction: Direction) => void;
  onAction: () => void;
  onMenuToggle: () => void;
  onOpenPanel: (panel: "inventory" | "journal") => void;
  onClosePanel: () => void;
  onChooseDialogue: (index: number) => void;
  onSelectItem: (itemId: Item["id"]) => void;
  onSelectJournal: (journalId: JournalEntry["id"]) => void;
  onManualSave: () => void;
  onLoad: () => void;
  onBackToTitle: () => void;
};

const directionButtons: Array<{
  direction: Direction;
  label: string;
  className: string;
}> = [
  { direction: "up", label: "▲", className: "dpad-button dpad-button--up" },
  { direction: "left", label: "◀", className: "dpad-button dpad-button--left" },
  { direction: "right", label: "▶", className: "dpad-button dpad-button--right" },
  { direction: "down", label: "▼", className: "dpad-button dpad-button--down" }
];

const getCellSymbol = (cell: ViewportCell) => {
  if (cell.isPlayer) {
    return "●";
  }
  if (cell.object) {
    switch (cell.object.kind) {
      case "door":
        return "◇";
      case "pickup":
        return "◆";
      case "hide":
        return "▥";
      case "seal":
        return "✣";
      case "inspect":
        return "◎";
    }
  }
  return cell.kind === "wall" ? "" : "";
};

const area = (state: GameState) => getCurrentMap(state);

export const GameShell = ({
  state,
  viewport,
  dialogue,
  areaText,
  actionLabel,
  actionTarget,
  inventoryItems,
  journalEntries,
  hasSave,
  onMove,
  onAction,
  onMenuToggle,
  onOpenPanel,
  onClosePanel,
  onChooseDialogue,
  onSelectItem,
  onSelectJournal,
  onManualSave,
  onLoad,
  onBackToTitle
}: GameShellProps) => (
  <main className={`game-shell ${state.chase.active ? "game-shell--danger" : ""}`}>
    <section className="frame-card">
      <header className="top-bar">
        <div>
          <p className="eyebrow">{area(state).name}</p>
          <h1>{area(state).subtitle}</h1>
        </div>
        <div className="top-actions">
          <span className="status-chip">{formatPlayTime(state.playTimeSeconds)}</span>
          <button className="menu-button" onClick={onMenuToggle} disabled={state.chase.active}>
            メニュー
          </button>
        </div>
      </header>

      <section className="world-panel">
        <div className="status-strip">
          <p>{areaText}</p>
          {state.chase.active ? (
            <span className="status-chip status-chip--danger">
              追跡 {Math.max(state.chase.maxDistance - state.chase.pursuerDistance, 0)}
            </span>
          ) : (
            <span className="status-chip">{area(state).name}</span>
          )}
        </div>
        <div className="viewport-grid" aria-label="探索エリア">
          {viewport.map((cell) => (
            <div
              key={cell.key}
              className={[
                "viewport-cell",
                `viewport-cell--${cell.kind}`,
                cell.object ? `viewport-cell--${cell.object.kind}` : "",
                cell.object ? `viewport-cell--glow-${cell.object.glow ?? "none"}` : "",
                cell.isPlayer ? "is-player" : "",
                cell.distance >= 3 ? "is-dim" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span>{getCellSymbol(cell)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lower-panel">
        <div className="dialogue-card">
          {dialogue ? (
            <>
              <div className="dialogue-head">
                <span className={`dialogue-tone dialogue-tone--${dialogue.tone ?? "calm"}`} />
                <strong>{dialogue.speaker}</strong>
              </div>
              <p>{dialogue.text}</p>
              {dialogue.choices ? (
                <div className="choice-list">
                  {dialogue.choices.map((choice, index) => (
                    <button
                      key={`${dialogue.id}-${choice.label}`}
                      className="choice-button"
                      onClick={() => onChooseDialogue(index)}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="hint-text">右下のボタンか Enter / Space で先へ進む</p>
              )}
            </>
          ) : (
            <>
              <div className="dialogue-head">
                <span className="dialogue-tone dialogue-tone--calm" />
                <strong>{actionTarget?.label ?? area(state).name}</strong>
              </div>
              <p>{state.lastStatusText}</p>
              <p className="hint-text">
                {actionTarget
                  ? `${actionTarget.label}: ${actionTarget.description}`
                  : "近くの違和感に向き直って、右下のボタンで調べる。"}
              </p>
            </>
          )}
        </div>

        <div className="controls-row">
          <div className="dpad">
            {directionButtons.map((button) => (
              <button
                key={button.direction}
                className={button.className}
                onClick={() => onMove(button.direction)}
                disabled={Boolean(state.activePanel) || state.phase !== "exploration"}
              >
                {button.label}
              </button>
            ))}
          </div>

          <div className="action-stack">
            <button
              className="secondary-button"
              onClick={() => onOpenPanel("journal")}
              disabled={
                state.chase.active || state.phase !== "exploration" || journalEntries.length === 0
              }
            >
              記録
            </button>
            <button className="primary-button primary-button--panel" onClick={onAction}>
              {actionLabel}
            </button>
            <button
              className="secondary-button"
              onClick={() => onOpenPanel("inventory")}
              disabled={
                state.chase.active || state.phase !== "exploration" || inventoryItems.length === 0
              }
            >
              持物
            </button>
          </div>
        </div>
      </section>
    </section>

    {state.activePanel === "menu" ? (
      <section className="overlay">
        <div className="overlay-card">
          <h2>メニュー</h2>
          <div className="menu-grid">
            <button className="choice-button" onClick={onManualSave}>
              保存
            </button>
            <button className="choice-button" onClick={onLoad} disabled={!hasSave}>
              読込
            </button>
            <button className="choice-button" onClick={() => onOpenPanel("inventory")}>
              持物
            </button>
            <button className="choice-button" onClick={() => onOpenPanel("journal")}>
              記録
            </button>
            <button className="choice-button" onClick={onBackToTitle}>
              タイトルへ
            </button>
            <button className="choice-button choice-button--muted" onClick={onClosePanel}>
              閉じる
            </button>
          </div>
        </div>
      </section>
    ) : null}

    {state.activePanel === "inventory" ? (
      <section className="overlay">
        <div className="overlay-card overlay-card--detail">
          <div className="overlay-head">
            <h2>持物</h2>
            <button className="menu-button" onClick={onClosePanel}>
              閉じる
            </button>
          </div>
          <div className="detail-layout">
            <div className="detail-list">
              {inventoryItems.map((item) => (
                <button
                  key={item.id}
                  className={`list-button ${
                    state.inventory.highlightedItemId === item.id ? "is-active" : ""
                  }`}
                  onClick={() => onSelectItem(item.id)}
                >
                  <span>{item.name}</span>
                  <small>{item.tag}</small>
                </button>
              ))}
            </div>
            <article className="detail-body">
              {state.inventory.highlightedItemId ? (
                <>
                  <h3>{inventoryItems.find((item) => item.id === state.inventory.highlightedItemId)?.name}</h3>
                  <p>
                    {
                      inventoryItems.find((item) => item.id === state.inventory.highlightedItemId)
                        ?.description
                    }
                  </p>
                  <p className="hint-text">
                    {
                      inventoryItems.find((item) => item.id === state.inventory.highlightedItemId)
                        ?.detail
                    }
                  </p>
                </>
              ) : (
                <p className="hint-text">まだ何も持っていない。</p>
              )}
            </article>
          </div>
        </div>
      </section>
    ) : null}

    {state.activePanel === "journal" ? (
      <section className="overlay">
        <div className="overlay-card overlay-card--detail">
          <div className="overlay-head">
            <h2>記録</h2>
            <button className="menu-button" onClick={onClosePanel}>
              閉じる
            </button>
          </div>
          <div className="detail-layout">
            <div className="detail-list">
              {journalEntries.map((entry) => (
                <button
                  key={entry.id}
                  className={`list-button ${
                    state.selectedJournalId === entry.id ? "is-active" : ""
                  }`}
                  onClick={() => onSelectJournal(entry.id)}
                >
                  <span>{entry.title}</span>
                  <small>{entry.category}</small>
                </button>
              ))}
            </div>
            <article className="detail-body detail-body--scroll">
              {state.selectedJournalId ? (
                <>
                  <h3>{journalEntries.find((entry) => entry.id === state.selectedJournalId)?.title}</h3>
                  <p className="hint-text">
                    {
                      journalEntries.find((entry) => entry.id === state.selectedJournalId)
                        ?.excerpt
                    }
                  </p>
                  {journalEntries
                    .find((entry) => entry.id === state.selectedJournalId)
                    ?.pages.map((page) => (
                      <p key={page}>{page}</p>
                    ))}
                </>
              ) : (
                <p className="hint-text">まだ何も記録されていない。</p>
              )}
            </article>
          </div>
        </div>
      </section>
    ) : null}
  </main>
);

type ResultScreenProps = {
  eyebrow: string;
  title: string;
  body: string;
  actionLabel: string;
  hasContinue: boolean;
  onContinue: () => void;
  onTitle: () => void;
};

export const ResultScreen = ({
  eyebrow,
  title,
  body,
  actionLabel,
  hasContinue,
  onContinue,
  onTitle
}: ResultScreenProps) => (
  <main className="title-screen">
    <section className="title-card">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="title-copy">{body}</p>
      <div className="title-actions">
        <button className="primary-button" onClick={onTitle}>
          タイトルへ
        </button>
        <button className="ghost-button" onClick={onContinue} disabled={!hasContinue}>
          {actionLabel}
        </button>
      </div>
    </section>
  </main>
);

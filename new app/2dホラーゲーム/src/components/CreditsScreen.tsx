interface CreditsScreenProps {
  onTitle: () => void;
}

export function CreditsScreen({ onTitle }: CreditsScreenProps) {
  return (
    <section className="credits-screen screen-fade">
      <h2>23:58 Campus</h2>
      <p>企画・実装：Codex</p>
      <p>音響：Web Audio API</p>
      <p>キャラクター：CSS / SVG pixel style</p>
      <p>素材：外部有料素材なし</p>
      <button type="button" onClick={onTitle}>タイトルへ戻る</button>
    </section>
  );
}

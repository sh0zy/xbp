export function AppInfoCard() {
  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <p className="text-lg font-bold">KanaTime</p>
      <p className="text-xs text-dark-300 mt-1">神奈川大生のための非公式時間割アプリ</p>
      <p className="text-xs text-dark-400 mt-3">v1.0.0</p>
      <div className="mt-3 p-3 rounded-xl bg-dark-700/50">
        <p className="text-xs text-dark-300">
          このアプリは神奈川大学の非公式アプリです。
          大学公式サービスとは一切関係ありません。
          最新情報は大学公式情報を確認してください。
        </p>
      </div>
    </div>
  );
}

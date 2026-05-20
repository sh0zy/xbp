import { PageContainer } from "../../components/common/PageContainer";
import { EmptyState } from "../../components/common/EmptyState";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SessionList } from "./components/SessionList";
import { useAppStore } from "../../store/useAppStore";
import { useNavigate } from "react-router-dom";

export function HistoryPage() {
  const navigate = useNavigate();
  const sessions = useAppStore((s) => s.sessions);
  const removeSession = useAppStore((s) => s.removeSession);

  const sorted = [...sessions].sort((a, b) => b.startedAt - a.startedAt);

  return (
    <PageContainer>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-ink-800 dark:text-ink-100">
          履歴
        </h2>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          始められた回数だけ、十分。記録は軽く眺める用。
        </p>
      </div>
      {sorted.length === 0 ? (
        <EmptyState
          icon="📜"
          title="まだ記録はありません"
          description="最初の3分を始めると、ここに記録が残ります。"
          action={
            <PrimaryButton size="md" onClick={() => navigate("/start")}>
              3分だけ始める
            </PrimaryButton>
          }
        />
      ) : (
        <SessionList sessions={sorted} onRemove={removeSession} />
      )}
    </PageContainer>
  );
}

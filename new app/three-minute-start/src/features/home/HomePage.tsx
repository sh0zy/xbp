import { Link, useNavigate } from "react-router-dom";
import { PageContainer } from "../../components/common/PageContainer";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { Card } from "../../components/common/Card";
import { TemplateCard } from "../templates/components/TemplateCard";
import { useAppStore } from "../../store/useAppStore";
import { relativeTime } from "../../lib/utils";

export function HomePage() {
  const navigate = useNavigate();
  const templates = useAppStore((s) => s.templates);
  const sessions = useAppStore((s) => s.sessions);

  const recentTemplateIds = Array.from(
    new Set(
      sessions
        .filter((s) => s.templateId !== null)
        .map((s) => s.templateId as string),
    ),
  ).slice(0, 4);

  const recentTemplates = recentTemplateIds
    .map((id) => templates.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const recentSession = sessions[0];

  return (
    <PageContainer>
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-7 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          3-Minute Start
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight">
          始められない日でも、<br />まず3分だけ。
        </h2>
        <p className="mt-2 text-sm text-white/80">
          完璧じゃなくていい。最初の1歩だけやろう。
        </p>
        <PrimaryButton
          fullWidth
          size="xl"
          variant="secondary"
          className="mt-5 !bg-white !text-brand-700 hover:!bg-brand-50"
          onClick={() => navigate("/start")}
        >
          ▶ 3分だけ始める
        </PrimaryButton>
      </section>

      {recentTemplates.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-200">
              最近使ったテンプレ
            </h3>
            <Link
              to="/templates"
              className="text-xs font-medium text-brand-600 dark:text-brand-300"
            >
              すべて見る
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recentTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                compact
                onClick={() =>
                  navigate(`/start?templateId=${encodeURIComponent(t.id)}`)
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-200">
            直近のセッション
          </h3>
          <Link
            to="/history"
            className="text-xs font-medium text-brand-600 dark:text-brand-300"
          >
            履歴
          </Link>
        </div>
        {recentSession ? (
          <Card>
            <div className="text-[11px] text-ink-400 dark:text-ink-400">
              {relativeTime(recentSession.startedAt)}
            </div>
            <h4 className="mt-1 truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
              {recentSession.taskLabel || "(無題の作業)"}
            </h4>
            <p className="truncate text-xs text-ink-500 dark:text-ink-400">
              最初の1歩: {recentSession.chosenFirstStep}
            </p>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              まだ記録はありません。最初の3分を始めてみよう。
            </p>
          </Card>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-200">
            おすすめテンプレ
          </h3>
          <Link
            to="/templates"
            className="text-xs font-medium text-brand-600 dark:text-brand-300"
          >
            一覧
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {templates.slice(0, 4).map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              compact
              onClick={() =>
                navigate(`/start?templateId=${encodeURIComponent(t.id)}`)
              }
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

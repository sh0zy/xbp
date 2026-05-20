import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../../components/common/PageContainer";
import { TemplateCard } from "./components/TemplateCard";
import { AddTemplateTile } from "./components/AddTemplateTile";
import { TemplateEditorSheet } from "./components/TemplateEditorSheet";
import { useAppStore } from "../../store/useAppStore";

export function TemplatesPage() {
  const templates = useAppStore((s) => s.templates);
  const addTemplate = useAppStore((s) => s.addTemplate);
  const navigate = useNavigate();
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <PageContainer>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-ink-800 dark:text-ink-100">
          テンプレ
        </h2>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          ワンタップで「最初の1歩」付きで始められます。
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onClick={() =>
              navigate(`/start?templateId=${encodeURIComponent(t.id)}`)
            }
          />
        ))}
        <AddTemplateTile onClick={() => setEditorOpen(true)} />
      </div>

      <TemplateEditorSheet
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onCreate={(input) => {
          const id = addTemplate(input);
          navigate(`/start?templateId=${encodeURIComponent(id)}`);
        }}
      />
    </PageContainer>
  );
}

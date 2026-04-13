import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, back, right }: Props) {
  const nav = useNavigate();
  return (
    <div className="flex items-start gap-3 mb-4 safe-top">
      {back && (
        <button onClick={() => nav(-1)} className="ghost-button -ml-2 mt-1" aria-label="戻る">
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="flex-1">
        <h1 className="h1">{title}</h1>
        {subtitle && <p className="muted-text mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

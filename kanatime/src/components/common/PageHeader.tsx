import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
}

export function PageHeader({ title, back, right }: Props) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between h-14 sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-dark-200 active:text-white">
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}

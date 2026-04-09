import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
}

export function Header({ title, back, right }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-sm border-b border-surface-lighter px-4 py-3 flex items-center">
      {back && (
        <button onClick={() => navigate(-1)} className="mr-3 text-text-secondary text-lg">
          ←
        </button>
      )}
      <h1 className="text-lg font-bold flex-1 truncate">{title}</h1>
      {right && <div>{right}</div>}
    </header>
  );
}

interface Item {
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

interface Props {
  title: string;
  items: Item[];
}

export function SettingsGroup({ title, items }: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-4 py-2.5">
        <h3 className="text-xs font-semibold text-dark-300 uppercase tracking-wider">{title}</h3>
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          disabled={!item.onClick}
          className="w-full flex items-center justify-between px-4 py-3 border-t border-dark-600/50 text-left active:bg-dark-600/30 disabled:active:bg-transparent"
        >
          <div>
            <p className="text-sm">{item.label}</p>
            {item.description && <p className="text-xs text-dark-400 mt-0.5">{item.description}</p>}
          </div>
          {item.right}
        </button>
      ))}
    </div>
  );
}

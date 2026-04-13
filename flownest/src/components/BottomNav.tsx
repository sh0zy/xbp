import type { Route } from '../app/router';

interface Props {
  route: Route;
  navigate: (r: Route) => void;
}

const items: Array<{ key: Route['name']; label: string; icon: string; target: Route }> = [
  { key: 'home', label: 'ホーム', icon: '◐', target: { name: 'home' } },
  { key: 'templates', label: '朝', icon: '☀', target: { name: 'templates', mode: 'morning' } },
  { key: 'templates', label: '夜', icon: '☾', target: { name: 'templates', mode: 'night' } },
  { key: 'review', label: '記録', icon: '✓', target: { name: 'review' } },
  { key: 'settings', label: '設定', icon: '⚙', target: { name: 'settings' } },
];

export default function BottomNav({ route, navigate }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-md border-t border-nest-border bg-nest-surface/95 px-2 py-2 backdrop-blur">
        <ul className="flex items-stretch justify-between">
          {items.map((it, i) => {
            const active =
              route.name === it.target.name &&
              (it.target.name !== 'templates' ||
                ('mode' in route &&
                  'mode' in it.target &&
                  route.mode === it.target.mode));
            return (
              <li key={i} className="flex-1">
                <button
                  onClick={() => navigate(it.target)}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition ${
                    active
                      ? 'bg-nest-card text-nest-text'
                      : 'text-nest-sub hover:text-nest-text'
                  }`}
                >
                  <span
                    className={`text-lg leading-none ${
                      it.label === '朝'
                        ? 'text-nest-morning'
                        : it.label === '夜'
                          ? 'text-nest-night'
                          : 'text-nest-accent'
                    }`}
                  >
                    {it.icon}
                  </span>
                  <span>{it.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

import { ExternalLink, Globe, BookOpen, Building2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { KANAGAWA_OFFICIAL_LINKS } from '@/types';

interface LinkRow {
  label: string;
  sub: string;
  href: string;
  icon: typeof Globe;
  primary?: boolean;
}

const links: LinkRow[] = [
  {
    label: '神奈川大学 ウェブステーション',
    sub: '履修登録・成績確認など (公式ログインページ)',
    href: KANAGAWA_OFFICIAL_LINKS.webStation,
    icon: Globe,
    primary: true,
  },
  {
    label: '大学公式トップ',
    sub: 'お知らせ・学事暦',
    href: KANAGAWA_OFFICIAL_LINKS.topPage,
    icon: Building2,
  },
  {
    label: 'シラバス検索 (公式)',
    sub: '公式シラバスはこちら',
    href: KANAGAWA_OFFICIAL_LINKS.syllabus,
    icon: BookOpen,
  },
];

export function OfficialLinksPage() {
  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="大学公式情報" back />

      <div className="p-3 rounded-xl bg-accent-orange/10 border border-accent-orange/30 flex gap-2">
        <AlertTriangle size={16} className="text-accent-orange shrink-0 mt-0.5" />
        <div className="text-[11px] text-dark-200 leading-relaxed">
          KanaTime は<b>非公式アプリ</b>です。以下は大学公式サイトへの外部リンクです。<br />
          ログインはブラウザ上で行われます。本アプリはログイン情報を一切取得しません。
        </div>
      </div>

      <div className="space-y-2">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-2xl active:opacity-80 border ${
              l.primary
                ? 'bg-accent-blue/15 border-accent-blue/40'
                : 'bg-dark-700/50 border-dark-600'
            }`}
          >
            <l.icon size={20} className={l.primary ? 'text-accent-blue' : 'text-dark-200'} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${l.primary ? 'text-accent-blue' : 'text-dark-100'}`}>{l.label}</p>
              <p className="text-[10px] text-dark-400 mt-0.5 truncate">{l.sub}</p>
            </div>
            <ExternalLink size={14} className="text-dark-400 shrink-0" />
          </a>
        ))}
      </div>

      <p className="text-[10px] text-dark-400 text-center pt-2">
        外部リンクをタップするとブラウザが起動します
      </p>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';

export function ReviewRuleNotice() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-dark-700/50 text-xs text-dark-300">
      <ShieldCheck size={16} className="text-accent-green shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-dark-200">レビュー利用ルール</p>
        <ul className="mt-1 space-y-0.5 list-disc list-inside">
          <li>科目体験に関する評価に限定してください</li>
          <li>教員への個人攻撃は禁止です</li>
          <li>不適切な内容は通報により非表示になります</li>
          <li>レビューは個人の主観を含む参考情報です</li>
        </ul>
      </div>
    </div>
  );
}

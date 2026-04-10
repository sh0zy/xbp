import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SettingsGroup } from '@/components/settings/SettingsGroup';
import { AppInfoCard } from '@/components/settings/AppInfoCard';
import { useSettingsStore } from '@/store/settingsStore';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useReviewStore } from '@/store/reviewStore';
import { useCreditStore } from '@/store/creditStore';

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, load, update } = useSettingsStore();
  const courseStore = useCourseStore();
  const timetableStore = useTimetableStore();
  const assignmentStore = useAssignmentStore();
  const attendanceStore = useAttendanceStore();
  const reviewStore = useReviewStore();
  const creditStore = useCreditStore();

  useEffect(() => { load(); }, []);

  const handleReset = () => {
    if (confirm('すべてのデータを初期化しますか？')) {
      courseStore.resetToSeed();
      timetableStore.reset();
      assignmentStore.reset();
      attendanceStore.reset();
      reviewStore.reset();
      creditStore.reset();
      useSettingsStore.getState().reset();
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="設定" />

      <SettingsGroup
        title="一般"
        items={[
          {
            label: '非公式バナーを表示',
            description: 'ホーム画面に非公式アプリ通知を表示',
            right: (
              <input
                type="checkbox"
                checked={settings.showUnofficialBanner}
                onChange={(e) => update({ showUnofficialBanner: e.target.checked })}
                className="accent-accent-blue"
              />
            ),
          },
          {
            label: '通知',
            description: '課題締切やテストのリマインダー',
            right: (
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => update({ notificationsEnabled: e.target.checked })}
                className="accent-accent-blue"
              />
            ),
          },
        ]}
      />

      <SettingsGroup
        title="データ"
        items={[
          {
            label: '単位管理',
            right: <ChevronRight size={16} className="text-dark-400" />,
            onClick: () => navigate('/credits'),
          },
          {
            label: 'データを初期化',
            description: 'すべてのデータをリセットします',
            onClick: handleReset,
          },
        ]}
      />

      <SettingsGroup
        title="このアプリについて"
        items={[
          { label: '非公式アプリについて', description: 'このアプリは神奈川大学の非公式アプリです。大学公式サービスとは一切関係ありません。' },
          { label: 'レビュー利用ルール', description: 'レビューは個人の主観を含む参考情報です。教員への個人攻撃は禁止です。' },
        ]}
      />

      <AppInfoCard />
    </div>
  );
}

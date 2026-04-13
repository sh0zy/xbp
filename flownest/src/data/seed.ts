import type { RoutineTemplate } from '../types';
import { uid } from '../lib/id';

const t = (
  title: string,
  durationMinutes: number,
  order: number,
  skippable = false,
  notes?: string,
) => ({ id: uid(), title, durationMinutes, order, skippable, notes });

export const buildSeedTemplates = (): RoutineTemplate[] => {
  const now = Date.now();
  return [
    {
      id: uid(),
      mode: 'morning',
      name: '平日朝（大学）',
      targetTime: '08:30',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      tasks: [
        t('起床・水を飲む', 5, 0),
        t('顔を洗う・歯磨き', 8, 1),
        t('朝食', 15, 2, true),
        t('着替え', 7, 3),
        t('髪・身だしなみ', 8, 4, true),
        t('持ち物チェック', 5, 5),
        t('出発準備', 2, 6),
      ],
    },
    {
      id: uid(),
      mode: 'morning',
      name: 'バイト朝',
      targetTime: '09:45',
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      tasks: [
        t('起床', 5, 0),
        t('洗顔・歯磨き', 8, 1),
        t('軽食', 10, 2, true),
        t('制服・身支度', 10, 3),
        t('持ち物確認', 5, 4),
      ],
    },
    {
      id: uid(),
      mode: 'night',
      name: '課題あり夜',
      targetTime: '00:30',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      tasks: [
        t('帰宅・荷物整理', 10, 0),
        t('夕食', 30, 1),
        t('課題・勉強', 90, 2, false, '最優先'),
        t('お風呂', 25, 3),
        t('スキンケア・歯磨き', 10, 4),
        t('明日の準備', 10, 5),
        t('ストレッチ・読書', 10, 6, true),
      ],
    },
    {
      id: uid(),
      mode: 'night',
      name: '早寝夜',
      targetTime: '23:00',
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      tasks: [
        t('帰宅・片付け', 10, 0),
        t('夕食', 25, 1),
        t('お風呂', 25, 2),
        t('明日の準備', 10, 3),
        t('歯磨き・スキンケア', 10, 4),
      ],
    },
  ];
};

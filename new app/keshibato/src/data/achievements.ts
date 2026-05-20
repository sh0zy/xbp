import type { AchievementData } from '../types';

export const ACHIEVEMENTS: AchievementData[] = [
  { id: 'first_win', title: '初勝利', description: '1試合勝利する', condition: 'win_count>=1', reward: '定規 解放' },
  { id: 'win3', title: '連戦の覇者', description: '3試合勝利する', condition: 'win_count>=3', reward: 'バンパー机 解放' },
  { id: 'ko_double', title: '一掃', description: '1ターンで2個以上場外に落とす', condition: 'double_ko', reward: 'スキンチケット' },
  { id: 'cpu_normal', title: 'CPUノーマル撃破', description: 'CPU Normalに勝利', condition: 'beat_cpu_normal', reward: 'クリップ 解放' },
];

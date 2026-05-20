import type { MedalData } from '../types';

export const MEDALS: MedalData[] = [
  {
    id: 'medal_boss_50',
    name: '巨殻討伐勲章',
    tier: 'bronze',
    unlockStage: 50,
    description: 'Lv50 巨殻シーサーを撃破した証。かつての守護を打ち砕いた勲章。',
  },
  {
    id: 'medal_boss_150',
    name: '呪水封滅勲章',
    tier: 'silver',
    unlockStage: 150,
    description: 'Lv150 呪水マーライオンを撃破した証。不穏な世界を渡った証。',
  },
  {
    id: 'medal_boss_300',
    name: '深淵断絶勲章',
    tier: 'gold',
    unlockStage: 300,
    description: 'Lv300 深淵魔王スライムを撃破した証。前半の象徴を葬った。',
  },
  {
    id: 'medal_boss_500',
    name: '終焉断罪勲章',
    tier: 'blackgold',
    unlockStage: 500,
    description: 'Lv500 終焉獣ケシゴンを撃破した証。文具世界の災厄を断ち切った。',
  },
];

export const MEDAL_BY_STAGE: Record<number, MedalData> = {
  50: MEDALS[0],
  150: MEDALS[1],
  300: MEDALS[2],
  500: MEDALS[3],
};

export const MEDAL_TIER_COLOR: Record<MedalData['tier'], { base: string; rim: string; gem: string }> = {
  bronze: { base: '#b87333', rim: '#e0a060', gem: '#ffd166' },
  silver: { base: '#b5b5bf', rim: '#dcdce4', gem: '#7ecbff' },
  gold: { base: '#e0b000', rim: '#ffdd44', gem: '#ff4a4a' },
  blackgold: { base: '#1a1a22', rim: '#ffcc44', gem: '#ff0040' },
};

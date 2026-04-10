import { create } from 'zustand';
import type { CreditSummary } from '@/types';
import { creditRepo } from '@/repositories';

const defaultCredits: CreditSummary = {
  targetCredits: 124,
  completedCredits: 0,
  inProgressCredits: 0,
  plannedCredits: 0,
};

interface CreditState {
  credits: CreditSummary;
  load: () => void;
  update: (patch: Partial<CreditSummary>) => void;
  reset: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: defaultCredits,
  load: () => {
    const saved = creditRepo.getSingle();
    set({ credits: saved ?? defaultCredits });
  },
  update: (patch) => {
    const credits = { ...get().credits, ...patch };
    creditRepo.setSingle(credits);
    set({ credits });
  },
  reset: () => {
    creditRepo.setSingle(defaultCredits);
    set({ credits: defaultCredits });
  },
}));

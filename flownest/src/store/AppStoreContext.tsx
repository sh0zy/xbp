import { createContext, useContext } from 'react';
import type { AppStore } from './useAppStore';

export const AppStoreContext = createContext<AppStore | null>(null);

export const useStore = (): AppStore => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('AppStoreContext missing');
  return ctx;
};

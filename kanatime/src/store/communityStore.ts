import { create } from 'zustand';
import type { Friend, UserProfile, Circle, Topic } from '@/types/community';
import { seedFriends } from '@/data/seed/friends';
import { seedCircles, seedTopics } from '@/data/seed/circles';

/**
 * 交流機能の state。将来バックエンド接続しやすいよう、
 * store 経由でしか永続層に触れない構造にしている。
 */

const PROFILE_KEY = 'kanatime-profile';
const FRIENDS_KEY = 'kanatime-friends';

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveProfile(p: UserProfile | null) {
  if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  else localStorage.removeItem(PROFILE_KEY);
}

function loadFriends(): Friend[] {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return seedFriends;
}
function saveFriends(list: Friend[]) {
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(list));
}

interface CommunityState {
  profile: UserProfile | null;
  friends: Friend[];
  circles: Circle[];
  topics: Topic[];
  load: () => void;
  saveProfile: (p: UserProfile) => void;
  addFriend: (id: string) => void;
  removeFriend: (id: string) => void;
  searchFriends: (query: string, faculty?: string, campus?: string) => Friend[];
  reset: () => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  profile: null,
  friends: [],
  circles: seedCircles,
  topics: seedTopics,
  load: () => {
    set({
      profile: loadProfile(),
      friends: loadFriends(),
      circles: seedCircles,
      topics: seedTopics,
    });
  },
  saveProfile: (p) => {
    saveProfile(p);
    set({ profile: p });
  },
  addFriend: (id) => {
    const friends = get().friends.map((f) => f.id === id ? { ...f, isFriend: true } : f);
    saveFriends(friends);
    set({ friends });
  },
  removeFriend: (id) => {
    const friends = get().friends.map((f) => f.id === id ? { ...f, isFriend: false } : f);
    saveFriends(friends);
    set({ friends });
  },
  searchFriends: (query, faculty, campus) => {
    const q = query.trim().toLowerCase();
    return get().friends.filter((f) => {
      if (faculty && f.faculty !== faculty) return false;
      if (campus && f.campus !== campus) return false;
      if (!q) return true;
      return (
        f.displayName.toLowerCase().includes(q) ||
        f.handle.toLowerCase().includes(q) ||
        f.faculty.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  },
  reset: () => {
    saveProfile(null);
    saveFriends(seedFriends);
    set({ profile: null, friends: seedFriends });
  },
}));

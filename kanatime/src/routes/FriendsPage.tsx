import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { FriendCard } from '@/components/community/FriendCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useCommunityStore } from '@/store/communityStore';
import { FACULTIES, CAMPUSES } from '@/types';

export function FriendsPage() {
  const [params] = useSearchParams();
  const initialTab = params.get('tab') === 'search' ? 'search' : 'friends';
  const [tab, setTab] = useState<'friends' | 'search'>(initialTab);
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState('');
  const [campus, setCampus] = useState('');

  const { friends, load, searchFriends } = useCommunityStore();
  useEffect(() => { load(); }, []);

  const myFriends = friends.filter((f) => f.isFriend);
  const searchResults = searchFriends(query, faculty || undefined, campus || undefined)
    .filter((f) => !f.isFriend);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="友達" back />

      <div className="flex gap-2">
        <button
          onClick={() => setTab('friends')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium ${tab === 'friends' ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
        >
          友達 ({myFriends.length})
        </button>
        <button
          onClick={() => setTab('search')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium ${tab === 'search' ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
        >
          友達を探す
        </button>
      </div>

      {tab === 'friends' ? (
        myFriends.length === 0 ? (
          <EmptyState icon={Users} message="まだ友達がいません" sub="「友達を探す」から追加してみよう" />
        ) : (
          <div className="space-y-2">
            {myFriends.map((f) => <FriendCard key={f.id} friend={f} />)}
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="名前・ハンドル・タグで検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-dark-400 focus:outline-none focus:border-accent-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent-blue text-dark-50"
            >
              <option value="">学部: すべて</option>
              {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent-blue text-dark-50"
            >
              <option value="">キャンパス: すべて</option>
              {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <p className="text-xs text-dark-400">{searchResults.length}人見つかりました</p>
          {searchResults.length === 0 ? (
            <EmptyState icon={Search} message="該当する人が見つかりません" />
          ) : (
            <div className="space-y-2">
              {searchResults.map((f) => <FriendCard key={f.id} friend={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

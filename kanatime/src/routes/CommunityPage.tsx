import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Sparkles, MessageCircle, ChevronRight, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { FriendCard } from '@/components/community/FriendCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useCommunityStore } from '@/store/communityStore';

export function CommunityPage() {
  const navigate = useNavigate();
  const { profile, friends, topics, load } = useCommunityStore();

  useEffect(() => { load(); }, []);

  const myFriends = friends.filter((f) => f.isFriend);
  const suggested = friends.filter((f) => !f.isFriend && f.isSuggested).slice(0, 3);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="交流" />

      {/* プロフィールカード */}
      {profile ? (
        <button
          onClick={() => navigate('/community/profile')}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-dark-600 active:opacity-80 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold">
              {profile.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{profile.displayName}</p>
              <p className="text-[10px] text-dark-300">{profile.handle}</p>
              <p className="text-[10px] text-dark-400 mt-0.5">{profile.faculty} · {profile.campus}</p>
            </div>
            <ChevronRight size={18} className="text-dark-400" />
          </div>
        </button>
      ) : (
        <button
          onClick={() => navigate('/community/profile')}
          className="w-full p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/30 active:bg-accent-blue/20 text-left"
        >
          <div className="flex items-center gap-3">
            <UserPlus size={22} className="text-accent-blue shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm text-accent-blue">プロフィールを作ろう</p>
              <p className="text-[10px] text-dark-300 mt-0.5">興味タグを設定して同じ学部の人と繋がろう</p>
            </div>
            <ChevronRight size={18} className="text-accent-blue" />
          </div>
        </button>
      )}

      {/* ナビグリッド */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate('/community/friends')}
          className="flex flex-col items-start gap-1 p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 text-left"
        >
          <Users size={18} className="text-accent-blue" />
          <p className="text-xs font-medium">友達</p>
          <p className="text-[10px] text-dark-400">{myFriends.length}人</p>
        </button>
        <button
          onClick={() => navigate('/community/friends?tab=search')}
          className="flex flex-col items-start gap-1 p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 text-left"
        >
          <Search size={18} className="text-accent-green" />
          <p className="text-xs font-medium">友達を探す</p>
          <p className="text-[10px] text-dark-400">名前・タグで検索</p>
        </button>
        <button
          onClick={() => navigate('/community/circles')}
          className="flex flex-col items-start gap-1 p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 text-left"
        >
          <Sparkles size={18} className="text-accent-purple" />
          <p className="text-xs font-medium">サークル</p>
          <p className="text-[10px] text-dark-400">新歓情報</p>
        </button>
        <button
          onClick={() => navigate('/community/topics')}
          className="flex flex-col items-start gap-1 p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 text-left"
        >
          <MessageCircle size={18} className="text-accent-orange" />
          <p className="text-xs font-medium">話題</p>
          <p className="text-[10px] text-dark-400">{topics.length}件の話題</p>
        </button>
      </div>

      {/* おすすめ */}
      <SectionCard title="新入生おすすめ">
        {suggested.length === 0 ? (
          <EmptyState icon={Users} message="おすすめはまだありません" />
        ) : (
          <div className="space-y-2">
            {suggested.map((f) => <FriendCard key={f.id} friend={f} />)}
          </div>
        )}
        <button
          onClick={() => navigate('/community/friends?tab=search')}
          className="w-full mt-2 py-2 rounded-xl bg-dark-600 text-xs text-dark-200 active:bg-dark-500"
        >
          もっと見る
        </button>
      </SectionCard>

      <p className="text-[10px] text-dark-400 text-center pb-2">
        ※交流機能はモックデータで動作しています
      </p>
    </div>
  );
}

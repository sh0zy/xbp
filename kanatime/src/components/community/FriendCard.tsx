import { UserPlus, UserCheck } from 'lucide-react';
import type { Friend } from '@/types/community';
import { useCommunityStore } from '@/store/communityStore';

interface Props {
  friend: Friend;
}

export function FriendCard({ friend }: Props) {
  const { addFriend, removeFriend } = useCommunityStore();

  return (
    <div className="p-3 rounded-xl bg-dark-700/50 space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
          {friend.displayName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{friend.displayName}</p>
          <p className="text-[10px] text-dark-400">{friend.handle}</p>
          <p className="text-[10px] text-dark-300 mt-0.5">{friend.faculty} · {friend.campus} · {friend.grade}年</p>
        </div>
        <button
          onClick={() => friend.isFriend ? removeFriend(friend.id) : addFriend(friend.id)}
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            friend.isFriend
              ? 'bg-accent-green/20 text-accent-green active:bg-accent-green/30'
              : 'bg-accent-blue/20 text-accent-blue active:bg-accent-blue/30'
          }`}
        >
          {friend.isFriend ? <UserCheck size={12} /> : <UserPlus size={12} />}
          {friend.isFriend ? '友達' : '追加'}
        </button>
      </div>
      {friend.comment && (
        <p className="text-xs text-dark-200 leading-relaxed">{friend.comment}</p>
      )}
      {friend.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {friend.tags.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-dark-600 text-dark-200">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

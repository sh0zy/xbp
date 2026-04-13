import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useCommunityStore } from '@/store/communityStore';
import { FACULTIES, CAMPUSES, GRADES } from '@/types';
import { generateId } from '@/utils/id';

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { profile, load, saveProfile } = useCommunityStore();

  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [grade, setGrade] = useState<number>(1);
  const [faculty, setFaculty] = useState<string>(FACULTIES[0]);
  const [campus, setCampus] = useState<string>(CAMPUSES[0]);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setHandle(profile.handle);
      setGrade(profile.grade);
      setFaculty(profile.faculty);
      setCampus(profile.campus);
      setComment(profile.comment);
      setTags(profile.tags);
    }
  }, [profile]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t) || tags.length >= 8) { setTagInput(''); return; }
    setTags([...tags, t]);
    setTagInput('');
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const canSave = displayName.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    saveProfile({
      userId: profile?.userId ?? generateId(),
      displayName: displayName.trim(),
      handle: handle.trim() || `@${displayName.trim()}`,
      grade,
      faculty,
      campus,
      comment: comment.trim(),
      tags,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    });
    navigate('/community');
  };

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title={profile ? 'プロフィール編集' : 'プロフィール作成'} back />

      <div className="space-y-4">
        <div>
          <label className="text-xs text-dark-300 mb-1 block">表示名 <span className="text-accent-red">*</span></label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="あおい"
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue"
          />
        </div>
        <div>
          <label className="text-xs text-dark-300 mb-1 block">ハンドル</label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@aoi25"
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-dark-300 mb-1 block">学年</label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50"
            >
              {GRADES.map((g) => <option key={g} value={g}>{g}年</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-dark-300 mb-1 block">キャンパス</label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50"
            >
              {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-dark-300 mb-1 block">学部</label>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50"
          >
            {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-dark-300 mb-1 block">自己紹介</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="よろしくお願いします!"
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-dark-300 mb-1 block">興味タグ ({tags.length}/8)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="例: カフェ巡り"
              className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
            />
            <button onClick={addTag} className="px-3 py-2 rounded-xl bg-dark-600 text-xs text-dark-200 active:bg-dark-500">追加</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-blue/20 text-accent-blue text-xs">
                #{t}
                <button onClick={() => removeTag(t)} className="active:text-white"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-3 rounded-xl bg-accent-blue text-white text-sm font-medium disabled:opacity-40 active:bg-accent-blue/80"
        >
          保存
        </button>
      </div>
    </div>
  );
}

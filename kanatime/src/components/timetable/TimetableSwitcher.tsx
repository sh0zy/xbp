import { useState } from 'react';
import { ChevronDown, Plus, Copy, Pencil, Trash2, Check } from 'lucide-react';
import { useTimetableStore } from '@/store/timetableStore';

export function TimetableSwitcher() {
  const { sets, activeId, setActive, createSet, renameSet, deleteSet, duplicateSet } = useTimetableStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const active = sets.find((s) => s.id === activeId) ?? sets[0];
  if (!active) return null;

  const handleCreate = () => {
    const name = prompt('新しい時間割の名前', `時間割 ${sets.length + 1}`);
    if (name?.trim()) createSet(name.trim());
  };

  const handleDuplicate = (id: string, baseName: string) => {
    const name = prompt('複製後の名前', `${baseName} のコピー`);
    if (name?.trim()) duplicateSet(id, name.trim());
  };

  const handleDelete = (id: string) => {
    if (sets.length <= 1) {
      alert('最後の時間割は削除できません');
      return;
    }
    if (confirm('この時間割を削除しますか？ 含まれる授業もこの時間割からは消えます。')) {
      deleteSet(id);
    }
  };

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };
  const commitRename = () => {
    if (editingId && editName.trim()) renameSet(editingId, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 text-sm font-medium active:bg-dark-600"
      >
        <span className="truncate max-w-[140px]">{active.name}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 p-2 space-y-1">
            {sets.map((s) => (
              <div key={s.id} className="flex items-center gap-1">
                {editingId === s.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                      autoFocus
                      className="flex-1 min-w-0 bg-dark-700 border border-dark-500 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-accent-blue"
                    />
                    <button onClick={commitRename} className="p-1 text-accent-blue"><Check size={14} /></button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setActive(s.id); setOpen(false); }}
                      className={`flex-1 min-w-0 text-left text-xs px-2 py-1.5 rounded-md truncate ${s.id === activeId ? 'bg-accent-blue/20 text-accent-blue font-medium' : 'text-dark-200 active:bg-dark-600'}`}
                    >
                      {s.name}
                    </button>
                    <button onClick={() => startRename(s.id, s.name)} className="p-1 text-dark-300 active:text-white"><Pencil size={12} /></button>
                    <button onClick={() => handleDuplicate(s.id, s.name)} className="p-1 text-dark-300 active:text-white"><Copy size={12} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1 text-dark-300 active:text-accent-red"><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            ))}
            <button
              onClick={() => { handleCreate(); setOpen(false); }}
              className="w-full flex items-center gap-1.5 px-2 py-2 rounded-md text-xs text-accent-blue active:bg-dark-700"
            >
              <Plus size={14} /> 新しい時間割を作成
            </button>
          </div>
        </>
      )}
    </div>
  );
}

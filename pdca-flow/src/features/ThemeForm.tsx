import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { FormField, TextAreaField } from '../components/FormField';
import type { Category, Priority, ThemeStatus } from '../types';
import { CATEGORIES, PRIORITY_LABELS } from '../types';
import { today } from '../lib/date';

export function ThemeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { themes, addTheme, updateTheme } = useApp();
  const navigate = useNavigate();

  const existing = isEdit ? themes.find((t) => t.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('study');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<ThemeStatus>('active');

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setCategory(existing.category);
      setGoal(existing.goal);
      setDeadline(existing.deadline);
      setPriority(existing.priority);
      setStatus(existing.status);
    }
  }, [existing]);

  const handleSave = () => {
    if (!title.trim()) return;
    if (isEdit && existing) {
      updateTheme({ ...existing, title, category, goal, deadline, priority, status });
    } else {
      addTheme({ title, category, goal, deadline: deadline || today(), priority, status });
    }
    navigate(-1);
  };

  return (
    <div className="pb-24">
      <Header title={isEdit ? 'テーマ編集' : '新規テーマ'} back />
      <div className="p-4 space-y-1">
        <FormField label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="テーマ名" />
        <label className="block mb-4">
          <span className="text-sm text-text-secondary mb-1 block">カテゴリ</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
        <TextAreaField label="目標" value={goal} onChange={setGoal} placeholder="何を達成したいか" />
        <FormField label="期限" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <label className="block mb-4">
          <span className="text-sm text-text-secondary mb-1 block">優先度</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none"
          >
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        {isEdit && (
          <label className="block mb-4">
            <span className="text-sm text-text-secondary mb-1 block">ステータス</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ThemeStatus)}
              className="w-full bg-surface-light rounded-xl px-4 py-3 text-text-primary outline-none"
            >
              <option value="active">進行中</option>
              <option value="paused">一時停止</option>
              <option value="completed">完了</option>
              <option value="archived">アーカイブ</option>
            </select>
          </label>
        )}
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-base disabled:opacity-40 mt-4"
        >
          {isEdit ? '更新する' : '作成する'}
        </button>
      </div>
    </div>
  );
}

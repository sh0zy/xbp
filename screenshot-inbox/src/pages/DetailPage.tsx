import { useState } from 'react';
import {
  ArrowLeft, Star, Calendar, Hash, Link2, DollarSign,
  Tag, Bell, Edit3, Archive, CheckCircle2, Trash2,
  ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getCategoryLabel, getStatusLabel } from '../utils/ocr';
import type { ScreenshotItem, Category, ItemStatus } from '../types';

interface Props {
  item: ScreenshotItem;
  onBack: () => void;
}

const categories: { id: Category; label: string }[] = [
  { id: 'event_ticket', label: 'Event / Ticket' },
  { id: 'order_receipt', label: 'Order / Receipt' },
  { id: 'membership_code', label: 'Membership / Code' },
  { id: 'recipe_food', label: 'Recipe / Food' },
  { id: 'memo_note', label: 'Memo / Note' },
  { id: 'other', label: 'Other' },
];

export function DetailPage({ item, onBack }: Props) {
  const { updateItem, toggleFavorite, archiveItem, completeItem, deleteItem, addReminder, setCategory, setStatus } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note);
  const [showOcr, setShowOcr] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSave = () => {
    updateItem(item.id, { title, note });
    setIsEditing(false);
  };

  const handleAddReminder = () => {
    if (reminderDate) {
      addReminder(item.id, new Date(reminderDate).toISOString(), reminderNote);
      setShowReminderForm(false);
      setReminderDate('');
      setReminderNote('');
    }
  };

  const handleDelete = () => {
    if (confirm('このアイテムを削除しますか？')) {
      deleteItem(item.id);
      onBack();
    }
  };

  const data = item.extractedData;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(item.id)}
            className="p-2"
          >
            <Star
              size={20}
              className={item.isFavorite ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}
            />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500"
          >
            <Edit3 size={18} />
          </button>
        </div>
      </div>

      {/* Image Preview */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setShowImage(!showImage)}
          className="w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200"
        >
          <img
            src={showImage ? item.imageData : item.thumbnailData}
            alt={item.title}
            className={`w-full ${showImage ? '' : 'h-48'} object-cover`}
          />
        </button>
      </div>

      {/* Title & Category */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          {isEditing ? (
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 focus:outline-none focus:border-primary-500"
                placeholder="タイトル"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-sm text-gray-600 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary-500 min-h-[80px]"
                placeholder="メモを追加..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700"
                >
                  {getCategoryLabel(item.category)}
                </button>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {getStatusLabel(item.status)}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  信頼度: {Math.round(item.confidence * 100)}%
                </span>
              </div>
              {item.note && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{item.note}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Category Picker */}
      {showCategoryPicker && (
        <div className="px-4 mt-2">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(item.id, cat.id);
                  setShowCategoryPicker(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  item.category === cat.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Data */}
      {(data.dates.length > 0 || data.amounts.length > 0 || data.codes.length > 0 || data.urls.length > 0) && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">抽出された情報</h3>
            {data.dates.length > 0 && (
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">{data.dates.join('、')}</div>
              </div>
            )}
            {data.times.length > 0 && (
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-accent-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">{data.times.join('、')}</div>
              </div>
            )}
            {data.amounts.length > 0 && (
              <div className="flex items-start gap-2">
                <DollarSign size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">{data.amounts.join('、')}</div>
              </div>
            )}
            {data.codes.length > 0 && (
              <div className="flex items-start gap-2">
                <Hash size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 break-all">{data.codes.join('、')}</div>
              </div>
            )}
            {data.urls.length > 0 && (
              <div className="flex items-start gap-2">
                <Link2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-600 break-all">{data.urls.join('\n')}</div>
              </div>
            )}
            {item.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OCR Text */}
      <div className="px-4 mt-3">
        <button
          onClick={() => setShowOcr(!showOcr)}
          className="w-full bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-700">抽出テキスト</span>
          {showOcr ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showOcr && (
          <div className="bg-white border border-gray-100 border-t-0 rounded-b-2xl px-4 pb-4 -mt-2">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-xl p-3 mt-2">
              {item.ocrText || 'テキストなし'}
            </pre>
          </div>
        )}
      </div>

      {/* Reminders */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Bell size={14} className="text-accent-500" />
              リマインダー
            </h3>
            <button
              onClick={() => setShowReminderForm(!showReminderForm)}
              className="text-xs text-primary-600 font-medium"
            >
              + 追加
            </button>
          </div>
          {item.reminders.map((r) => (
            <div key={r.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
              <input
                type="checkbox"
                checked={r.completed}
                onChange={() => useStore.getState().completeReminder(item.id, r.id)}
                className="rounded text-primary-600"
              />
              <div className="flex-1">
                <div className={`text-sm ${r.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {r.note || 'リマインド'}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(r.date).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
          ))}
          {showReminderForm && (
            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <input
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                placeholder="メモ（任意）"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleAddReminder}
                className="w-full py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"
              >
                リマインド設定
              </button>
            </div>
          )}
          {item.reminders.length === 0 && !showReminderForm && (
            <p className="text-xs text-gray-400">リマインダーなし</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {item.status !== 'completed' && (
            <button
              onClick={() => { completeItem(item.id); onBack(); }}
              className="w-full px-4 py-3.5 flex items-center gap-3 text-success-600 border-b border-gray-50"
            >
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">完了にする</span>
            </button>
          )}
          <button
            onClick={() => {
              setStatus(item.id, item.status === 'needs_action' ? 'saved' : 'needs_action');
            }}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-gray-700 border-b border-gray-50"
          >
            <Tag size={18} />
            <span className="text-sm font-medium">
              {item.status === 'needs_action' ? '保存済みにする' : '要対応にする'}
            </span>
          </button>
          <button
            onClick={() => { archiveItem(item.id); onBack(); }}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-gray-500 border-b border-gray-50"
          >
            <Archive size={18} />
            <span className="text-sm font-medium">アーカイブ</span>
          </button>
          <button
            onClick={handleDelete}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-danger-500"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">削除</span>
          </button>
        </div>
      </div>
    </div>
  );
}

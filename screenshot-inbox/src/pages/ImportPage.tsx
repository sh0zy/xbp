import { useState, useRef } from 'react';
import { Upload, X, Loader2, Check, ImagePlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import { readFileAsDataURL, createThumbnail } from '../utils/image';
import { analyzeText } from '../utils/ocr';
import type { ScreenshotItem } from '../types';

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

interface ProcessingFile {
  id: string;
  name: string;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: ScreenshotItem;
}

export function ImportPage({ onClose, onComplete }: Props) {
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addItems = useStore((s) => s.addItems);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: ProcessingFile[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!file.type.startsWith('image/')) continue;
      const preview = await readFileAsDataURL(file);
      newFiles.push({
        id: uuidv4(),
        name: file.name,
        preview,
        status: 'pending',
      });
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const processAll = async () => {
    setIsProcessing(true);
    const results: ScreenshotItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status !== 'pending') continue;

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'processing' as const } : f))
      );

      try {
        // Simulate OCR processing (Tesseract.js is heavy; use simplified approach for MVP)
        const ocrText = await simulateOCR(file.name);
        const analysis = analyzeText(ocrText);
        const thumbnail = await createThumbnail(file.preview);

        const item: ScreenshotItem = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          importedAt: new Date().toISOString(),
          imageData: file.preview,
          thumbnailData: thumbnail,
          ocrText,
          category: analysis.category,
          status: 'inbox',
          title: analysis.title,
          note: '',
          extractedData: analysis.extractedData,
          reminders: [],
          completedAt: null,
          archivedAt: null,
          tags: analysis.suggestedTags,
          sourceType: 'gallery',
          confidence: analysis.confidence,
          isFavorite: false,
        };

        results.push(item);
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: 'done' as const, result: item } : f))
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: 'error' as const } : f))
        );
      }
    }

    if (results.length > 0) {
      addItems(results);
    }
    setIsProcessing(false);
    setIsDone(true);
  };

  const doneCount = files.filter((f) => f.status === 'done').length;
  const pendingCount = files.filter((f) => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-500">
          <X size={22} />
        </button>
        <h1 className="font-bold text-gray-900">スクショ取り込み</h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        {/* Upload Area */}
        {!isDone && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-primary-300 bg-primary-50/50 rounded-2xl p-8 flex flex-col items-center gap-3 mb-4 hover:bg-primary-50 transition-colors"
          >
            <ImagePlus size={36} className="text-primary-400" />
            <span className="text-sm font-medium text-primary-600">
              画像を選択（複数OK）
            </span>
            <span className="text-xs text-gray-400">
              JPG, PNG 対応
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-xl p-3 flex items-center gap-3 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={file.preview} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <div className="mt-1">
                    {file.status === 'pending' && (
                      <span className="text-xs text-gray-400">待機中</span>
                    )}
                    {file.status === 'processing' && (
                      <span className="text-xs text-primary-500 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" />
                        解析中...
                      </span>
                    )}
                    {file.status === 'done' && (
                      <span className="text-xs text-success-600 flex items-center gap-1">
                        <Check size={12} />
                        {file.result?.title}
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-xs text-danger-500">エラー</span>
                    )}
                  </div>
                </div>
                {file.status === 'pending' && !isProcessing && (
                  <button onClick={() => removeFile(file.id)} className="p-1 text-gray-300">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isDone && files.length > 0 && (
          <button
            onClick={processAll}
            disabled={isProcessing || pendingCount === 0}
            className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                解析中... ({doneCount}/{files.length})
              </>
            ) : (
              <>
                <Upload size={18} />
                {pendingCount}枚を取り込む
              </>
            )}
          </button>
        )}

        {/* Done */}
        {isDone && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-success-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {doneCount}枚を救出しました！
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Inbox で確認・整理しましょう
            </p>
            <button
              onClick={onComplete}
              className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              Inbox を見る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simplified OCR simulation using filename patterns
// In production, this would use Tesseract.js or native OCR
async function simulateOCR(filename: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));

  const lower = filename.toLowerCase();
  if (lower.includes('ticket') || lower.includes('event')) {
    return 'イベントチケット\n日時: 2026/05/01 19:00\n会場: 渋谷ホール\n座席: A-15';
  }
  if (lower.includes('order') || lower.includes('receipt') || lower.includes('amazon')) {
    return '注文確認\n注文番号: ORD-2026-0401\n商品名: サンプル商品\n合計: ¥3,980';
  }
  if (lower.includes('member') || lower.includes('card') || lower.includes('coupon')) {
    return '会員カード\n会員番号: MEM-12345\nポイント: 500pt\n有効期限: 2026/12/31';
  }
  if (lower.includes('recipe') || lower.includes('food') || lower.includes('cook')) {
    return 'レシピメモ\n材料: 卵 3個、砂糖 大さじ2\n作り方: よく混ぜて焼く';
  }

  // Default: generate basic OCR text from file
  return `取り込み画像\nファイル名: ${filename}\n取り込み日時: ${new Date().toLocaleDateString('ja-JP')}`;
}

import { useState } from 'react';
import { Camera, Search, Bell, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateSampleData } from '../utils/sample-data';

const slides = [
  {
    icon: Camera,
    color: 'bg-primary-500',
    title: 'スクショを取り込む',
    description: '溜まったスクリーンショットを\nまとめて取り込めます',
  },
  {
    icon: Search,
    color: 'bg-accent-500',
    title: 'テキストを自動抽出',
    description: '画像からテキストを読み取り\n日付・金額・コードを自動で検出',
  },
  {
    icon: Bell,
    color: 'bg-warning-500',
    title: '期限前にリマインド',
    description: 'クーポンやチケットの期限を\n逃さずお知らせ',
  },
  {
    icon: CheckCircle2,
    color: 'bg-success-500',
    title: '行動に変える',
    description: '「あとで見る」で終わらない\n使える情報に変えるアプリです',
  },
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const loadSampleData = useStore((s) => s.loadSampleData);

  const handleComplete = (withSample: boolean) => {
    if (withSample) {
      const samples = generateSampleData();
      loadSampleData(samples);
    }
    completeOnboarding();
  };

  const isLast = step === slides.length;

  if (isLast) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <Sparkles size={36} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          準備完了！
        </h1>
        <p className="text-gray-500 text-center text-sm mb-10 max-w-xs">
          まずはスクリーンショットを取り込んで、<br />
          整理を始めましょう
        </p>

        <button
          onClick={() => handleComplete(true)}
          className="w-full max-w-xs py-3.5 bg-primary-600 text-white rounded-2xl font-semibold text-sm hover:bg-primary-700 transition-colors mb-3"
        >
          サンプルデータで試す
        </button>
        <button
          onClick={() => handleComplete(false)}
          className="w-full max-w-xs py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          スキップして始める
        </button>
      </div>
    );
  }

  const slide = slides[step];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={`w-24 h-24 ${slide.color} rounded-3xl flex items-center justify-center mb-8 shadow-lg`}>
          <Icon size={44} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {slide.title}
        </h2>
        <p className="text-gray-500 text-center text-sm whitespace-pre-line max-w-xs">
          {slide.description}
        </p>
      </div>

      <div className="px-6 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep(step + 1)}
          className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
        >
          {step === slides.length - 1 ? '始める' : '次へ'}
          <ArrowRight size={16} />
        </button>
        {step < slides.length - 1 && (
          <button
            onClick={() => setStep(slides.length)}
            className="w-full py-2 text-gray-400 text-sm mt-2"
          >
            スキップ
          </button>
        )}
      </div>
    </div>
  );
}

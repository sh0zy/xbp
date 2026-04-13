import { Link } from 'react-router-dom'
import { useCourseStore } from '../store/useCourseStore'

export default function Settings() {
  const resetAll = useCourseStore((s) => s.resetAll)

  const onReset = (): void => {
    if (!confirm('すべてのデータを初期化します。よろしいですか？')) return
    resetAll()
    alert('初期化しました')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center">
        <Link to="/" className="h-11 px-2 flex items-center text-neutral-400">
          ← 戻る
        </Link>
        <h1 className="ml-2 text-lg font-bold text-neutral-100">設定</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-2">
            キワドリについて
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            大学の単位を「ギリギリ」で守り切るための単位管理アプリ。
            出席・課題・中間の記録から、期末で必要な点数をリアルタイムに計算します。
          </p>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-2">
            データ
          </h2>
          <button
            className="w-full h-11 rounded-md bg-red-600 text-white font-medium"
            onClick={onReset}
          >
            データを初期化
          </button>
          <p className="text-xs text-neutral-500 mt-2">
            登録した科目とスコアがすべて消えます。
          </p>
        </section>
      </main>
    </div>
  )
}

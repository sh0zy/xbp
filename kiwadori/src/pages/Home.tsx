import { Link } from 'react-router-dom'
import { useCourseStore } from '../store/useCourseStore'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const courses = useCourseStore((s) => s.courses)
  const recordAttendance = useCourseStore((s) => s.recordAttendance)

  const today = new Date().getDay()
  const todaysCourses = courses.filter((c) => c.dayOfWeek === today)

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-100">キワドリ</h1>
        <Link
          to="/settings"
          className="h-11 px-3 flex items-center text-sm text-neutral-400"
        >
          設定
        </Link>
      </header>

      <main className="px-4 py-4 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-neutral-400 mb-2">
            今日の授業
          </h2>
          {todaysCourses.length === 0 ? (
            <p className="text-sm text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              今日の授業はありません
            </p>
          ) : (
            <div className="space-y-3">
              {todaysCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onRecord={(attended) => recordAttendance(c.id, attended)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-neutral-400 mb-2">
            全科目
          </h2>
          <div className="space-y-3">
            {courses.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                onRecord={(attended) => recordAttendance(c.id, attended)}
              />
            ))}
          </div>
        </section>
      </main>

      <Link
        to="/courses/new"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 text-white text-3xl flex items-center justify-center shadow-lg active:bg-indigo-500"
        aria-label="新規登録"
      >
        ＋
      </Link>
    </div>
  )
}

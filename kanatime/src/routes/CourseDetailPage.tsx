import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { CourseHero } from '@/components/course/CourseHero';
import { CourseActions } from '@/components/course/CourseActions';
import { SectionCard } from '@/components/common/SectionCard';
import { ReviewScoreBars } from '@/components/reviews/ReviewScoreBars';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewRuleNotice } from '@/components/reviews/ReviewRuleNotice';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { useReviewStore } from '@/store/reviewStore';
import { COURSE_COLORS } from '@/types';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, load: loadCourses } = useCourseStore();
  const { entries, load: loadTimetable } = useTimetableStore();
  const { load: loadReviews, getForCourse, getAverages } = useReviewStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCourses();
    loadTimetable();
    loadReviews();
  }, []);

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <div className="pt-14 text-center text-dark-400">授業が見つかりません</div>;

  const entry = entries.find((e) => e.courseId === course.id);
  const colorIdx = entry ? entries.indexOf(entry) : 0;
  const color = entry?.customColor || COURSE_COLORS[colorIdx % COURSE_COLORS.length];
  const reviews = getForCourse(course.id);
  const averages = getAverages(course.id);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="授業詳細" back />
      <CourseHero course={course} color={color} />
      <CourseActions courseId={course.id} syllabusUrl={course.syllabusUrl} />

      <SectionCard title="履修しやすさ">
        <ReviewScoreBars averages={averages} reviewCount={reviews.length} />
      </SectionCard>

      <SectionCard title="レビュー">
        <ReviewRuleNotice />
        <div className="mt-3">
          <ReviewList reviews={reviews} />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mt-3 py-2.5 rounded-xl bg-dark-600 text-sm font-medium text-dark-200 active:bg-dark-500"
        >
          {showForm ? 'フォームを閉じる' : 'レビューを書く'}
        </button>
        {showForm && (
          <div className="mt-3">
            <ReviewForm courseId={course.id} onDone={() => setShowForm(false)} />
          </div>
        )}
      </SectionCard>
    </div>
  );
}

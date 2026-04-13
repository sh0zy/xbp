import type { Course } from '../types'

const KEY = 'kiwadori:courses:v1'

export function loadCourses(): Course[] | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed as Course[]
  } catch {
    return null
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(courses))
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function clearCourses(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

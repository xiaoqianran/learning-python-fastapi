import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LESSONS } from '../data/lessons'

type ProgressState = {
  completed: Record<string, boolean>
  quizScores: Record<string, number> // lessonSlug -> correct count
  notes: Record<string, string>
  lastVisited: string | null
  markComplete: (slug: string) => void
  setQuizScore: (slug: string, score: number) => void
  setNote: (slug: string, note: string) => void
  setLastVisited: (slug: string) => void
  reset: () => void
  completedCount: () => number
  totalCount: () => number
  percent: () => number
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      quizScores: {},
      notes: {},
      lastVisited: null,
      markComplete: (slug) =>
        set((s) => ({ completed: { ...s.completed, [slug]: true } })),
      setQuizScore: (slug, score) =>
        set((s) => ({ quizScores: { ...s.quizScores, [slug]: score } })),
      setNote: (slug, note) =>
        set((s) => ({ notes: { ...s.notes, [slug]: note } })),
      setLastVisited: (slug) => set({ lastVisited: slug }),
      reset: () => set({ completed: {}, quizScores: {}, notes: {}, lastVisited: null }),
      completedCount: () => Object.values(get().completed).filter(Boolean).length,
      totalCount: () => LESSONS.length,
      percent: () => {
        const total = LESSONS.length
        if (total === 0) return 0
        return Math.round((Object.values(get().completed).filter(Boolean).length / total) * 100)
      },
    }),
    { name: 'learning-fastapi-progress' }
  )
)

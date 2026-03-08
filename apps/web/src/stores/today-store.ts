import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TodayStore {
  selectedProjectId: string | null
  setSelectedProjectId: (projectId: string | null) => void
}

// AC 3, 4: Store with localStorage persistence
export const useTodayStore = create<TodayStore>()(
  persist(
    (set) => ({
      selectedProjectId: null,

      setSelectedProjectId: (projectId) => {
        set({ selectedProjectId: projectId })
      },
    }),
    {
      name: 'today-storage', // AC 4: localStorage key
    }
  )
)

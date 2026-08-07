import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set) => ({
      onboardingProgress: {
        accountInfo: false,
        keywords: false,
        sources: false,
        publishers: false
      },

      setOnboardingProgress: (progress) =>
        set({
          onboardingProgress: progress
        })
    }),
    {
      name: 'dashboard-storage'
    }
  )
)
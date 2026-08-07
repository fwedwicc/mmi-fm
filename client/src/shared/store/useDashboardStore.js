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
        }),

      completeStep: (step) =>
        set((state) => ({
          onboardingProgress: {
            ...state.onboardingProgress,
            [step]: true
          }
        })),

      resetOnboardingProgress: () =>
        set({
          onboardingProgress: {
            accountInfo: false,
            keywords: false,
            sources: false,
            publishers: false
          }
        })
    }),
    {
      name: 'dashboard-storage'
    }
  )
)
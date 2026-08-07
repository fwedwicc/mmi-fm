import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      isLoading: false,
      error: null,

      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          error: null
        }),

      setLoading: (isLoading) =>
        set({
          isLoading
        }),

      setError: (error) =>
        set({
          error,
          isLoading: false
        }),

      clearError: () =>
        set({
          error: null
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
    }),
    {
      name: 'user-storage',

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../store'

const RouteGuard = ({
  requireAuth = false,
  requireOnboarding = false,
  requireCompletedOnboarding = false
}) => {
  const { isAuthenticated, token, user } = useUserStore()

  const authenticated = isAuthenticated && !!token

  // =========================
  // AUTHENTICATION REQUIRED
  // =========================

  if (requireAuth) {
    if (!authenticated) {
      return <Navigate to="/login" replace />
    }
  }

  // =========================
  // ONBOARDING REQUIRED
  // =========================

  if (requireOnboarding) {
    if (!authenticated) {
      return <Navigate to="/login" replace />
    }

    // Already completed onboarding
    // Don't allow user to go back
    if (user?.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />
    }
  }

  // =========================
  // COMPLETED ONBOARDING REQUIRED
  // =========================

  if (requireCompletedOnboarding) {
    if (!authenticated) {
      return <Navigate to="/login" replace />
    }

    // Hasn't completed onboarding yet
    if (!user?.onboardingCompleted) {
      return <Navigate to="/onboarding" replace />
    }
  }

  // =========================
  // GUEST ROUTES
  // =========================

  if (!requireAuth && !requireOnboarding && !requireCompletedOnboarding) {
    if (authenticated) {
      return user?.onboardingCompleted
        ? <Navigate to="/dashboard" replace />
        : <Navigate to="/onboarding" replace />
    }
  }

  return <Outlet />
}

export default RouteGuard
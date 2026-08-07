import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDashboardStore } from '../store'

const steps = [
  {
    path: '/onboarding/account-info',
    key: 'accountInfo'
  },
  {
    path: '/onboarding/keywords',
    key: 'keywords'
  },
  {
    path: '/onboarding/sources',
    key: 'sources'
  },
  {
    path: '/onboarding/publishers',
    key: 'publishers'
  },
  {
    path: '/onboarding/review',
    key: 'review'
  }
]

const OnboardingRoute = () => {
  const location = useLocation()

  const onboardingProgress = useDashboardStore(
    (state) => state.onboardingProgress
  )

  const currentIndex = steps.findIndex(
    (step) => step.path === location.pathname
  )

  const firstIncompleteIndex = steps.findIndex(
    (step) => !onboardingProgress?.[step.key]
  )

  // Prevent jumping forward
  if (
    firstIncompleteIndex !== -1 &&
    currentIndex > firstIncompleteIndex
  ) {
    return (
      <Navigate
        to={steps[firstIncompleteIndex].path}
        replace
      />
    )
  }

  // Prevent going backward
  if (
    firstIncompleteIndex !== -1 &&
    currentIndex < firstIncompleteIndex
  ) {
    return (
      <Navigate
        to={steps[firstIncompleteIndex].path}
        replace
      />
    )
  }

  return <Outlet />
}

export default OnboardingRoute
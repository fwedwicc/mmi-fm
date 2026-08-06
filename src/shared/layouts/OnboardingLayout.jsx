import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar as OnboardingSidebar } from '../components/custom/onboarding'

const OnboardingLayout = () => {
  return (
    <main className='min-h-screen'>
      <OnboardingSidebar />
      <Outlet />
    </main>
  )
}

export default OnboardingLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar as OnboardingSidebar } from '../components/custom/onboarding'

const OnboardingLayout = () => {
  return (
    <div className='min-h-screen'>
      <OnboardingSidebar />
      <Outlet />
    </div>
  )
}

export default OnboardingLayout
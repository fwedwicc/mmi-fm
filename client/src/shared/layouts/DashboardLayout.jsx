import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/custom'

const DashboardLayout = ({ mode = 'onboarding' }) => {
  return (
    <main className='min-h-screen'>
      <Sidebar mode={mode} />
      <Outlet />
    </main>
  )
}

export default DashboardLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar as DashboardSidebar } from '../components/custom/dashboard'

const DashboardLayout = () => {
  return (
    <main className='min-h-screen'>
      <DashboardSidebar />
      <Outlet />
    </main>
  )
}

export default DashboardLayout
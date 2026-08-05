import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar as DashboardSidebar } from '../components/custom/dashboard'

const DashboardLayout = () => {
  return (
    <div className='min-h-screen'>
      <DashboardSidebar />
      <Outlet />
    </div>
  )
}

export default DashboardLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/custom'

const DashboardLayout = () => {
  return (
    <main className='min-h-screen'>
      <Sidebar />
      <Outlet />
    </main>
  )
}

export default DashboardLayout
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
// import { Home, AboutPhased, Features, Help, Download } from '../../pages/landing'
// import { AuthRoute, ProtectedRoute } from './index'
// import { Navbar, SimpleNavbar } from '../components/custom/landing'
// import { UserDashboard } from '../../pages/user'
// import NotFound from '../../pages/NotFound'
// import CommingSoon from '../../pages/CommingSoon'
import { SignUp, Login } from '../../pages/authentication'
// import { useScrollToTop } from '../hooks'
// import { useLinksStore } from '../store'

const AppContent = () => {
  const location = useLocation()

  // fix scroll to top
  // useScrollToTop()

  return (
    <>
      <Routes>
        {/* GLOBAL ROUTES */}
        <Route path='/' element={<SignUp />} />
        <Route path='/login' element={<Login />} />

        {/* AUTHENTICATION ROUTES */}
        {/* <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
        <Route path='/signup' element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path='/forgot-password' element={<AuthRoute><ForgotPassword /></AuthRoute>} /> */}

        {/* USER PROTECTED ROUTES */}
        {/* <Route element={<ProtectedRoute userOnly={true} />}>
          <Route path="/home" element={<UserDashboard />} />
          <Route path="/community" element={<UserDashboard />} />
          <Route path="/analytics" element={<UserDashboard />} />
          <Route path="/help-center" element={<UserDashboard />} />
          <Route path="/settings" element={<UserDashboard />} />
        </Route> */}

        {/* ADMIN PROTECTED ROUTES */}
        {/* <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin-controls" element={<UserDashboard />} />
          <Route path="/mod-controls" element={<UserDashboard />} />
          <Route path="/activity-logs" element={<UserDashboard />} />
        </Route> */}

        {/* 404 - CATCH ALL */}
        {/* <Route path="*" element={<NotFound />} />
        <Route path="/coming-soon" element={<CommingSoon />} /> */}
      </Routes>
    </>
  )
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default AppRouter
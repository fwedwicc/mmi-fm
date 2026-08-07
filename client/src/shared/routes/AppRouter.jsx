import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { SignUp, Login } from '../../pages/authentication'
import {
  AccountInformation,
  Keywords,
  Sources,
  Publishers,
  Review,
  Home
} from '../../pages/dashboard'

import { DashboardLayout } from '../layouts'
import { RouteGuard, OnboardingRoute } from './index'

const AppContent = () => {
  return (
    <Routes>

      {/* GUEST ROUTES */}
      <Route element={<RouteGuard />}>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>


      {/* ONBOARDING */}
      <Route element={<RouteGuard requireOnboarding />}>

        <Route element={<OnboardingRoute />}>

          <Route path="/onboarding" element={<DashboardLayout />}>

            <Route
              index
              element={<Navigate to="account-info" replace />}
            />

            <Route
              path="account-info"
              element={<AccountInformation />}
            />

            <Route
              path="keywords"
              element={<Keywords />}
            />

            <Route
              path="sources"
              element={<Sources />}
            />

            <Route
              path="publishers"
              element={<Publishers />}
            />

            <Route
              path="review"
              element={<Review />}
            />

          </Route>

        </Route>

      </Route>


      {/* DASHBOARD */}
      <Route element={<RouteGuard requireCompletedOnboarding />}>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
        </Route>

      </Route>

    </Routes>
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
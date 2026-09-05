import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppHeader } from './cmps/AppHeader.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Onboarding } from './pages/Onboarding.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'

export function RootCmp() {
  const user = useSelector(state => state.userModule.user)

  // Verify if onboarding was completed in MongoDB
  const hasCompletedOnboarding = Boolean(user?.hasCompletedOnboarding)

  return (
    <div className="app-container">
      <div className="ambient-glow"></div>
      
      {/* Header containing ONLY the centered tabs navigation for authenticated state */}
      <AppHeader />

      <main className="main-content">
        <Routes>
          {/* Unauthenticated / Guest Flow */}
          <Route
            path="/auth"
            element={
              !user ? (
                <LoginSignup />
              ) : hasCompletedOnboarding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          {/* Onboarding Flow: Requires login; if guest redirects to /auth */}
          <Route
            path="/onboarding"
            element={
              !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <Onboarding />
              )
            }
          />

          {/* Dashboard Flow: Requires login AND hasCompletedOnboarding === true */}
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/auth" replace />
              ) : !hasCompletedOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Dashboard />
              )
            }
          />

          {/* Default Root Path Navigation */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/auth" replace />
              ) : hasCompletedOnboarding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          {/* Catch-all Fallback */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <UserMsg />
    </div>
  )
}

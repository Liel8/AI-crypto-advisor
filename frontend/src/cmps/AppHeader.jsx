import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/user.actions.js'
import { showSuccessMsg } from '../services/event-bus.service.js'

export function AppHeader() {
  const user = useSelector(state => state.userModule.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const hasCompletedOnboarding = Boolean(user?.hasCompletedOnboarding)

  const handleLogout = async () => {
    await dispatch(logout())
    showSuccessMsg('Logged out successfully')
    navigate('/auth')
  }

  // If user is not logged in, do not render navigation tabs that let guests jump between protected screens
  if (!user) {
    return (
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px', color: '#38bdf8' }}>
            CryptoPulse AI
          </span>
          <span className="brand-badge">ADVISOR</span>
        </div>
      </header>
    )
  }

  return (
    <header className="app-header">
      <nav className="screen-switcher" aria-label="Application Screen Navigation">
        {hasCompletedOnboarding && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `screen-btn ${isActive ? 'active' : ''}`}
          >
            <span>📊</span> Daily AI Dashboard
          </NavLink>
        )}

        <NavLink 
          to="/onboarding" 
          className={({ isActive }) => `screen-btn ${isActive ? 'active' : ''}`}
        >
          <span>🧭</span> {hasCompletedOnboarding ? 'Edit Preferences' : 'Onboarding Quiz'}
        </NavLink>

        <button 
          type="button" 
          className="screen-btn" 
          onClick={handleLogout}
          title="Sign out of your account"
        >
          <span>🚪</span> Logout
        </button>
      </nav>
    </header>
  )
}

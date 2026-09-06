import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/user.actions.js'
import { ThemeToggle } from './ThemeToggle.jsx'

function getUserInitials(name) {
  if (!name || typeof name !== 'string') return 'IN'
  const trimmed = name.trim()
  if (!trimmed) return 'IN'
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return trimmed.slice(0, Math.min(trimmed.length, 2)).toUpperCase()
}

export function AppHeader() {
  const user = useSelector(state => state.userModule.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const hasCompletedOnboarding = Boolean(user?.hasCompletedOnboarding)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/auth')
  }

  const brandDestination = user && hasCompletedOnboarding ? '/dashboard' : '/'
  const displayName = user?.fullname || user?.username || 'Investor'
  const initials = getUserInitials(displayName)

  // Unauthenticated / guest state: brand on left, ThemeToggle on right
  if (!user) {
    return (
      <header className="app-header">
        <div className="header-container">
          <div className="header-left">
            <Link to={brandDestination} className="header-brand" aria-label="CryptoPulse AI Home">
              <div className="brand-logo-badge" aria-hidden="true">
                <span className="brand-logo-icon">⚡</span>
              </div>
              <span className="brand-logo-text">
                CryptoPulse <span className="brand-accent">AI</span>
              </span>
            </Link>
          </div>
          <div className="header-center" />
          <div className="header-right">
            <ThemeToggle />
          </div>
        </div>
      </header>
    )
  }

  // Authenticated state: brand on left, nav truly centered, utilities on right
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to={brandDestination} className="header-brand" aria-label="CryptoPulse AI Home">
            <div className="brand-logo-badge" aria-hidden="true">
              <span className="brand-logo-icon">⚡</span>
            </div>
            <span className="brand-logo-text">
              CryptoPulse <span className="brand-accent">AI</span>
            </span>
          </Link>
        </div>

        <nav className="header-nav header-center" aria-label="Main Navigation">
          {hasCompletedOnboarding && (
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
          )}

          <NavLink 
            to="/onboarding" 
            className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
          >
            Preferences
          </NavLink>
        </nav>

        <div className="header-right">
          <ThemeToggle />

          <div className="header-divider" aria-hidden="true" />

          <div className="header-user-area">
            <div className="user-avatar" aria-hidden="true" title={displayName}>
              {initials}
            </div>
            <span className="user-name" title={displayName}>
              {displayName}
            </span>
            <span className="user-dot-separator" aria-hidden="true">·</span>
            <button 
              type="button" 
              className="btn-logout" 
              onClick={handleLogout}
              title="Sign out of your account"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}



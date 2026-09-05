import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, signup } from '../store/user.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function LoginSignup() {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [credentials, setCredentials] = useState({
    fullname: '',
    email: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    try {
      let loggedinUser
      if (isRegisterMode) {
        loggedinUser = await dispatch(signup(credentials))
        showSuccessMsg(`Welcome aboard, ${credentials.fullname}!`)
      } else {
        loggedinUser = await dispatch(login(credentials))
        showSuccessMsg('Logged in successfully!')
      }

      // Redirect strictly based on hasCompletedOnboarding from MongoDB
      if (loggedinUser?.hasCompletedOnboarding) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    } catch (err) {
      showErrorMsg(err.response?.data?.err || err.message || 'Authentication failed')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegisterMode ? 'active' : ''}`}
            onClick={() => setIsRegisterMode(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegisterMode ? 'active' : ''}`}
            onClick={() => setIsRegisterMode(true)}
          >
            Create Account
          </button>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">
            {isRegisterMode ? 'Create Your Free Account' : 'Welcome to CryptoPulse'}
          </h1>
          <p className="auth-subtitle">
            {isRegisterMode
              ? 'Start your AI tailored crypto journey in 60 seconds'
              : 'Your personalized, AI-driven crypto dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="fullname">Full Name</label>
              <div className="input-container">
                <span className="input-icon">👤</span>
                <input
                  id="fullname"
                  name="fullname"
                  className="form-input"
                  type="text"
                  placeholder="Alex Morgan"
                  value={credentials.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                name="email"
                className="form-input"
                type="email"
                placeholder="alex@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a
              href="#forgot"
              className="forgot-link"
              onClick={(e) => {
                e.preventDefault()
                showSuccessMsg('Password reset link simulated')
              }}
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-primary">
            <span>{isRegisterMode ? 'Register & Start Onboarding Quiz' : 'Sign In & Enter Dashboard'}</span>
            <span>→</span>
          </button>
        </form>

        <footer className="auth-footer" style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Secure Express JWT / Cookie Authentication</span>
        </footer>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, signup } from '../store/user.actions.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', test: (pwd) => (pwd || '').length >= 8 },
  { id: 'uppercase', label: 'At least one uppercase letter', test: (pwd) => /[A-Z]/.test(pwd || '') },
  { id: 'lowercase', label: 'At least one lowercase letter', test: (pwd) => /[a-z]/.test(pwd || '') },
  { id: 'number', label: 'At least one number', test: (pwd) => /\d/.test(pwd || '') },
]

export function LoginSignup() {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [credentials, setCredentials] = useState({
    fullname: '',
    email: '',
    password: ''
  })
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSwitchMode = (register) => {
    setIsRegisterMode(register)
    setEmailError('')
    setPasswordError('')
    setLoginError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))

    if (loginError) {
      setLoginError('')
    }

    if (name === 'email' && emailError) {
      setEmailError('')
    }
    if (name === 'password' && passwordError) {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    let hasError = false
    const trimmedEmail = credentials.email.trim()

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.')
      hasError = true
    } else {
      setEmailError('')
    }

    if (isRegisterMode) {
      if (!PASSWORD_REGEX.test(credentials.password)) {
        setPasswordError('Password must meet all of the requirements below.')
        hasError = true
      } else {
        setPasswordError('')
      }
    }

    if (hasError) return

    try {
      let loggedinUser
      const payload = {
        ...credentials,
        email: trimmedEmail
      }

      if (isRegisterMode) {
        loggedinUser = await dispatch(signup(payload))
      } else {
        loggedinUser = await dispatch(login(payload))
      }

      // Redirect strictly based on hasCompletedOnboarding from MongoDB
      if (loggedinUser?.hasCompletedOnboarding) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    } catch (err) {
      if (!isRegisterMode) {
        if (err.response?.status === 401) {
          setLoginError('Invalid email or password. Please check your credentials and try again.')
        } else {
          showErrorMsg(err.response?.data?.err || err.message || 'Authentication failed. Please try again.')
        }
      } else {
        showErrorMsg(err.response?.data?.err || err.message || 'Failed to create account. Please try again.')
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isRegisterMode ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="auth-subtitle">
            {isRegisterMode
              ? 'Start your AI-tailored crypto dashboard'
              : 'Enter your credentials to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="fullname">Full Name</label>
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
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              className={`form-input ${emailError ? 'input-error' : ''}`}
              type="email"
              placeholder="alex@example.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            {emailError && (
              <div className="auth-field-error" role="alert">
                {emailError}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className={`form-input ${
                (isRegisterMode && passwordError) || (!isRegisterMode && loginError)
                  ? 'input-error'
                  : ''
              }`}
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {!isRegisterMode && loginError && (
              <div className="auth-field-error" role="alert">
                {loginError}
              </div>
            )}
            {isRegisterMode && passwordError && (
              <div className="auth-field-error" role="alert">
                {passwordError}
              </div>
            )}
            {isRegisterMode && (
              <ul className="auth-password-requirements" aria-label="Password requirements">
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const isMet = req.test(credentials.password)
                  return (
                    <li
                      key={req.id}
                      className={`auth-req-item ${isMet ? 'met' : 'unmet'}`}
                    >
                      <span className="auth-req-icon" aria-hidden="true">
                        {isMet ? '✓' : '✕'}
                      </span>
                      <span className="auth-req-label">{req.label}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <button type="submit" className="auth-submit-btn">
            {isRegisterMode ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          {isRegisterMode ? (
            <p className="auth-switch-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => handleSwitchMode(false)}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="auth-switch-text">
              New to CryptoPulse?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => handleSwitchMode(true)}
              >
                Create account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

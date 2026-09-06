import React, { useState, useEffect } from 'react'

// Initialize theme immediately on module load to prevent visual flash
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  } catch {
    return 'light'
  }
}

// Apply initially if running in browser
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', getInitialTheme())
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (err) {
      console.warn('Unable to persist theme to localStorage:', err)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      className={`theme-toggle-btn theme-${theme}`}
      onClick={toggleTheme}
      aria-label={`Theme toggle. Currently in ${theme} mode. Click to switch to ${isLight ? 'dark' : 'light'} mode.`}
      aria-pressed={!isLight}
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
    >
      <span className={`theme-toggle-segment ${isLight ? 'active' : ''}`} aria-hidden="true">
        <span>☀️</span>
      </span>
      <span className={`theme-toggle-segment ${!isLight ? 'active' : ''}`} aria-hidden="true">
        <span>🌙</span>
      </span>
    </button>
  )
}

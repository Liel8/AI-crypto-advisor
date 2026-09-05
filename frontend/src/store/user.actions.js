import { authService } from '../services/auth.service.js'
import { userService } from '../services/user.service.js'
import { SET_USER, UPDATE_PREFERENCES } from './user.reducer.js'
import { CLEAR_DASHBOARD } from './dashboard.reducer.js'

export function login(credentials) {
  return async (dispatch) => {
    try {
      dispatch({ type: CLEAR_DASHBOARD })
      const user = await authService.login(credentials)
      dispatch({ type: SET_USER, user })
      return user
    } catch (err) {
      console.error('Cannot login', err)
      throw err
    }
  }
}

export function signup(credentials) {
  return async (dispatch) => {
    try {
      dispatch({ type: CLEAR_DASHBOARD })
      const user = await authService.signup(credentials)
      dispatch({ type: SET_USER, user })
      return user
    } catch (err) {
      console.error('Cannot signup', err)
      throw err
    }
  }
}

export function logout() {
  return async (dispatch) => {
    try {
      await authService.logout()
      dispatch({ type: SET_USER, user: null })
      dispatch({ type: CLEAR_DASHBOARD })
    } catch (err) {
      console.error('Cannot logout', err)
      throw err
    }
  }
}

export function savePreferences(preferences) {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.updatePreferences(preferences)
      const currentUser = authService.getLoggedinUser() || {}
      const mergedUser = {
        ...currentUser,
        ...updatedUser,
        preferences: updatedUser?.preferences || preferences,
        hasCompletedOnboarding: true
      }
      authService.saveLoggedinUser(mergedUser)
      dispatch({ type: SET_USER, user: mergedUser })
      return mergedUser
    } catch (err) {
      console.error('Failed to save preferences in backend', err)
      throw err
    }
  }
}

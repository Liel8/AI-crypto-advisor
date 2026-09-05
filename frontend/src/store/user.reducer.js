import { authService } from '../services/auth.service.js'

export const SET_USER = 'SET_USER'
export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES'

const initialState = {
  user: authService.getLoggedinUser() || null
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user }
    case UPDATE_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: action.preferences,
          hasCompletedOnboarding: true
        }
      }
    default:
      return state
  }
}

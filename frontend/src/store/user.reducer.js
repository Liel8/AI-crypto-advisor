import { authService } from '../services/auth.service.js'

export const SET_USER = 'SET_USER'

const initialState = {
  user: authService.getLoggedinUser() || null
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user }

    default:
      return state
  }
}

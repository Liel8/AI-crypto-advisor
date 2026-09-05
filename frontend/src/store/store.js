import { createStore, combineReducers, applyMiddleware } from 'redux'
import { userReducer } from './user.reducer.js'
import { dashboardReducer } from './dashboard.reducer.js'

// Simple lightweight thunk middleware
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return next(action)
}

const rootReducer = combineReducers({
  userModule: userReducer,
  dashboardModule: dashboardReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

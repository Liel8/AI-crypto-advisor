import { dashboardService } from '../services/dashboard.service.js'
import {
  SET_DASHBOARD,
  SET_LOADING,
  CLEAR_DASHBOARD,
  SET_MEME,
  SET_AI_INSIGHT,
  SET_AI_LOADING,
  UPDATE_VOTES
} from './dashboard.reducer.js'

export function loadDashboard(preferences, userId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: CLEAR_DASHBOARD })
      dispatch({ type: SET_LOADING, isLoading: true })

      const activeUserId = userId || getState().userModule.user?._id

      // 1. Fast load of core dashboard from authenticated session (coins, news, meme, preferences, votes)
      const dashboard = await dashboardService.getDailyDashboard()
      dispatch({ type: SET_DASHBOARD, dashboard })

      // 2. Decoupled AI load in background - does not block dashboard rendering
      const contentList = dashboard?.content || preferences?.content
      const showAi = !contentList || contentList.includes('AI Insights') || contentList.length === 0
      if (showAi) {
        dispatch(loadAiInsight(activeUserId))
      }

      return dashboard
    } catch (err) {
      console.error('Cannot load dashboard', err)
      dispatch({ type: SET_LOADING, isLoading: false })
      throw err
    }
  }
}

export function loadAiInsight(targetUserId) {
  return async (dispatch, getState) => {
    const activeUserId = (typeof targetUserId === 'string' && targetUserId.length === 24)
      ? targetUserId
      : getState().userModule.user?._id

    try {
      dispatch({ type: SET_AI_LOADING, isAiLoading: true })
      const aiInsight = await dashboardService.getAiInsight()

      // Anti-leak check: Ensure the response belongs to the still-active user and dashboard
      const currentDashboard = getState().dashboardModule.data
      const currentUser = getState().userModule.user
      if (!currentDashboard || (activeUserId && currentUser?._id !== activeUserId)) {
        return
      }

      dispatch({ type: SET_AI_INSIGHT, aiInsight })
      return aiInsight
    } catch (err) {
      console.error('Cannot load AI insight', err)
      dispatch({ type: SET_AI_LOADING, isAiLoading: false })
    }
  }
}

export function fetchNextMeme(currentId) {
  return async (dispatch) => {
    try {
      const meme = await dashboardService.getNextMeme(currentId)
      dispatch({ type: SET_MEME, meme })
      return meme
    } catch (err) {
      console.error('Cannot load next meme', err)
    }
  }
}

export function regenerateInsight(targetUserId) {
  return async (dispatch, getState) => {
    const activeUserId = (typeof targetUserId === 'string' && targetUserId.length === 24)
      ? targetUserId
      : getState().userModule.user?._id

    try {
      dispatch({ type: SET_AI_LOADING, isAiLoading: true })
      const aiInsight = await dashboardService.regenerateAiInsight()

      // Anti-leak check: Ensure the response belongs to the still-active user and dashboard
      const currentDashboard = getState().dashboardModule.data
      const currentUser = getState().userModule.user
      if (!currentDashboard || (activeUserId && currentUser?._id !== activeUserId)) {
        return
      }

      dispatch({ type: SET_AI_INSIGHT, aiInsight })
      return aiInsight
    } catch (err) {
      console.error('Cannot regenerate AI insight', err)
      dispatch({ type: SET_AI_LOADING, isAiLoading: false })
    }
  }
}



export function voteSection(section, vote, persona) {
  return async (dispatch) => {
    try {
      const res = await dashboardService.recordVote({ section, vote, persona })
      if (res?.userVote !== undefined) {
        dispatch({
          type: UPDATE_VOTES,
          section,
          userVote: res.userVote,
          userVotes: res.userVotes
        })
      }
    } catch (err) {
      console.error('Cannot submit vote', err)
    }
  }
}

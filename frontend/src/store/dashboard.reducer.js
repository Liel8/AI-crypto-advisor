export const SET_DASHBOARD = 'SET_DASHBOARD'
export const SET_MEME = 'SET_MEME'
export const SET_AI_INSIGHT = 'SET_AI_INSIGHT'
export const SET_AI_LOADING = 'SET_AI_LOADING'
export const UPDATE_VOTES = 'UPDATE_VOTES'
export const SET_LOADING = 'SET_LOADING'
export const CLEAR_DASHBOARD = 'CLEAR_DASHBOARD'

const initialState = {
  data: null,
  isLoading: false,
  isAiLoading: false
}

export function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD:
      return { ...state, data: action.dashboard, isLoading: false }
    case CLEAR_DASHBOARD:
      return { ...state, data: null, isLoading: false, isAiLoading: false }
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
        data: action.isLoading ? null : state.data
      }
    case SET_AI_LOADING:
      return {
        ...state,
        isAiLoading: action.isAiLoading
      }

    case SET_MEME:
      if (!state.data) return state
      return {
        ...state,
        data: {
          ...state.data,
          sections: {
            ...state.data.sections,
            meme: {
              ...state.data.sections.meme,
              data: action.meme
            }
          }
        }
      }
    case SET_AI_INSIGHT:
      if (!state.data) return state
      return {
        ...state,
        isAiLoading: false,
        data: {
          ...state.data,
          sections: {
            ...state.data.sections,
            aiInsight: {
              ...state.data.sections.aiInsight,
              data: action.aiInsight
            }
          }
        }
      }

    case UPDATE_VOTES:
      if (!state.data) return state
      return {
        ...state,
        data: {
          ...state.data,
          sections: {
            ...state.data.sections,
            [action.section]: {
              ...state.data.sections[action.section],
              userVote: action.userVote
            }
          },
          userVotes: action.userVotes || state.data.userVotes
        }
      }
    default:
      return state
  }
}

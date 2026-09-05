import { httpService } from './http.service.js'

export const dashboardService = {
  getDailyDashboard,
  getAiInsight,
  getNextMeme,
  regenerateAiInsight,
  recordVote
}

async function getDailyDashboard(queryParams = {}) {
  return await httpService.get('dashboard', queryParams)
}

async function getAiInsight(queryParams = {}) {
  return await httpService.get('dashboard/ai', queryParams)
}

async function getNextMeme(currentId) {
  return await httpService.get('dashboard/meme/next', { currentId })
}

async function regenerateAiInsight() {
  return await httpService.post('dashboard/ai/regenerate')
}


async function recordVote({ section, vote, persona }) {
  return await httpService.post('feedback/vote', { section, vote, persona })
}


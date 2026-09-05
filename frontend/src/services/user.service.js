import { httpService } from './http.service.js'

export const userService = {
  getById,
  updatePreferences
}

async function getById(userId) {
  return await httpService.get(`user/${userId}`)
}

async function updatePreferences(preferences) {
  return await httpService.post('user/preferences', preferences)
}

import { httpService } from './http.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const authService = {
  login,
  signup,
  logout,
  getLoggedinUser,
  saveLoggedinUser
}

async function login(userCred) {
  const user = await httpService.post('auth/login', userCred)
  if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
  const user = await httpService.post('auth/signup', userCred)
  if (user) return saveLoggedinUser(user)
}

async function logout() {
  await httpService.post('auth/logout')
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
  const entity = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
  return entity ? JSON.parse(entity) : null
}

function saveLoggedinUser(user) {
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

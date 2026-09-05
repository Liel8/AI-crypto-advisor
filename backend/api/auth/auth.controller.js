import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'

export async function login(req, res) {
  const { email, password } = req.body
  try {
    const user = await authService.login(email, password)
    const loginToken = authService.getLoginToken(user)

    res.cookie('loginToken', loginToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    res.json({ ...user, token: loginToken })
  } catch (err) {
    logger.error('Failed to Login ' + err.message)
    res.status(401).send({ err: err.message || 'Failed to Login' })
  }
}

export async function signup(req, res) {
  try {
    const { fullname, email, password } = req.body
    const user = await authService.signup({ fullname, email, password })
    const loginToken = authService.getLoginToken(user)

    res.cookie('loginToken', loginToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    res.json({ ...user, token: loginToken })
  } catch (err) {
    logger.error('Failed to signup ' + err.message)
    res.status(400).send({ err: err.message || 'Failed to signup' })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('loginToken', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    logger.error('Failed to logout ' + err.message)
    res.status(500).send({ err: 'Failed to logout' })
  }
}

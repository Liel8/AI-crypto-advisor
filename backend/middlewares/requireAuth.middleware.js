import { authService } from '../api/auth/auth.service.js'
import { logger } from '../services/logger.service.js'

export function requireAuth(req, res, next) {
  const loginToken = req.cookies.loginToken || req.headers.authorization?.replace('Bearer ', '')

  if (!loginToken) {
    return res.status(401).send({ err: 'Authentication required' })
  }

  const loggedinUser = authService.validateToken(loginToken)

  if (!loggedinUser) {
    return res.status(401).send({ err: 'Invalid or expired login token' })
  }

  req.loggedinUser = loggedinUser
  next()
}

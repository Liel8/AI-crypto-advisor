import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../config/index.js'
import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken
}

async function login(email, password) {
  logger.info(`auth.service - login attempt for email: ${email}`)

  const user = await userService.getByEmail(email)
  if (!user) throw new Error('Invalid email or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid email or password')

  const { password: _, ...miniUser } = user
  return miniUser
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

async function signup({ fullname, email, password }) {
  logger.info(`auth.service - signup for email: ${email}`)

  if (!email || !password || !fullname) {
    throw new Error('All fields are required')
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and a number')
  }

  const existingUser = await userService.getByEmail(email)
  if (existingUser) {
    throw new Error('An account with this email already exists')
  }

  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)

  const user = await userService.add({
    fullname,
    email,
    password: hash,
    preferences: null,
    hasCompletedOnboarding: false
  })

  const { password: _, ...miniUser } = user
  return miniUser
}

function getLoginToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullname: user.fullname
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  )
}

function validateToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (err) {
    return null
  }
}

import express from 'express'
import { getUser, updatePreferences } from './user.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const userRoutes = express.Router()

userRoutes.get('/:id', requireAuth, getUser)
userRoutes.put('/preferences', requireAuth, updatePreferences)
userRoutes.post('/preferences', requireAuth, updatePreferences)

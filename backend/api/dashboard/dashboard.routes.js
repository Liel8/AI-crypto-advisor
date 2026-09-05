import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getDashboard, getAiInsight, getNextMeme, regenerateAiInsight } from './dashboard.controller.js'

export const dashboardRoutes = express.Router()

dashboardRoutes.get('/', requireAuth, getDashboard)
dashboardRoutes.get('/ai', requireAuth, getAiInsight)
dashboardRoutes.get('/meme/next', requireAuth, getNextMeme)
dashboardRoutes.post('/ai/regenerate', requireAuth, regenerateAiInsight)



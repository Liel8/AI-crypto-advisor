import express from 'express'
import { recordVote, getUserVotes, getVotesSummary } from './feedback.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const feedbackRoutes = express.Router()

feedbackRoutes.post('/vote', requireAuth, recordVote)
feedbackRoutes.get('/my-votes', requireAuth, getUserVotes)
feedbackRoutes.get('/summary', getVotesSummary)

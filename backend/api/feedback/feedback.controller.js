import { feedbackService } from './feedback.service.js'
import { logger } from '../../services/logger.service.js'

export async function recordVote(req, res) {
  try {
    const { section, vote, persona } = req.body
    const userId = req.loggedinUser?._id

    if (!userId) {
      return res.status(401).send({ err: 'Authentication required to submit feedback' })
    }

    if (!section || !vote) {
      return res.status(400).send({ err: 'Section and vote are required' })
    }

    const result = await feedbackService.recordVote({
      userId: userId.toString(),
      section,
      vote,
      persona
    })

    res.json(result)
  } catch (err) {
    logger.error('Failed to record vote', err)
    res.status(500).send({ err: 'Failed to record vote' })
  }
}

export async function getUserVotes(req, res) {
  try {
    const userId = req.loggedinUser?._id
    const userVotes = await feedbackService.getUserVotes(userId)
    res.json(userVotes)
  } catch (err) {
    logger.error('Failed to get user votes', err)
    res.status(500).send({ err: 'Failed to get user votes' })
  }
}

export async function getVotesSummary(req, res) {
  try {
    const summary = await feedbackService.getVotesSummary()
    res.json(summary)
  } catch (err) {
    logger.error('Failed to get votes summary', err)
    res.status(500).send({ err: 'Failed to get votes summary' })
  }
}

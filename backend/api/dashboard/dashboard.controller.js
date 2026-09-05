import { dashboardService } from './dashboard.service.js'
import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export async function getDashboard(req, res) {
  try {
    const userId = req.loggedinUser?._id
    if (!userId) {
      return res.status(401).send({ err: 'Authentication required' })
    }

    const user = await userService.getById(userId)
    if (!user) {
      return res.status(401).send({ err: 'Invalid user' })
    }

    const preferences = user.preferences || {
      assets: ['BTC', 'ETH', 'SOL'],
      persona: 'HODLer',
      personaBadge: '💎 HODLer',
      content: ['Market News', 'Price Charts', 'AI Insights', 'Memes & Culture']
    }

    const dashboard = await dashboardService.getDailyDashboard(preferences, userId)
    res.json(dashboard)
  } catch (err) {
    logger.error('Failed to get dashboard', err)
    res.status(500).send({ err: 'Failed to compile daily dashboard' })
  }
}

export async function getNextMeme(req, res) {
  try {
    const meme = await dashboardService.getNextMeme(req.query.currentId)
    res.json(meme)
  } catch (err) {
    logger.error('Failed to get next meme', err)
    res.status(500).send({ err: 'Failed to fetch meme' })
  }
}

export async function getAiInsight(req, res) {
  try {
    const userId = req.loggedinUser?._id
    if (!userId) {
      return res.status(401).send({ err: 'Authentication required' })
    }

    const user = await userService.getById(userId)
    if (!user) {
      return res.status(401).send({ err: 'Invalid user' })
    }

    const persona = user.preferences?.persona || 'HODLer'
    const assets = user.preferences?.assets?.length ? user.preferences.assets : ['BTC', 'ETH', 'SOL']

    const aiInsight = await dashboardService.getAiInsight({ persona, assets })
    res.json(aiInsight)
  } catch (err) {
    logger.error('Failed to get AI insight', err)
    res.status(500).send({ err: 'Failed to generate AI insight' })
  }
}

export async function regenerateAiInsight(req, res) {
  try {
    const userId = req.loggedinUser?._id
    if (!userId) {
      return res.status(401).send({ err: 'Authentication required' })
    }

    const user = await userService.getById(userId)
    if (!user) {
      return res.status(401).send({ err: 'Invalid user' })
    }

    const persona = user.preferences?.persona || 'HODLer'
    const assets = user.preferences?.assets?.length ? user.preferences.assets : ['BTC', 'ETH', 'SOL']

    const aiInsight = await dashboardService.regenerateAiInsight({ persona, assets })
    res.json(aiInsight)
  } catch (err) {
    logger.error('Failed to regenerate AI insight', err)
    res.status(500).send({ err: 'Failed to regenerate AI insight' })
  }
}





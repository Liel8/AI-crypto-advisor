import { coingeckoService } from '../../services/coingecko.service.js'
import { marketNewsService } from '../../services/market-news.service.js'
import { aiService } from '../../services/ai.service.js'
import { memeService } from '../../services/meme.service.js'
import { feedbackService } from '../feedback/feedback.service.js'
import { logger } from '../../services/logger.service.js'

export const dashboardService = {
  getDailyDashboard,
  getAiInsight,
  getNextMeme,
  regenerateAiInsight
}

async function getDailyDashboard(preferences = {}, userId = null) {
  try {
    const assets = preferences.assets?.length ? preferences.assets : ['BTC', 'ETH', 'SOL']
    const persona = preferences.persona || 'HODLer'
    const personaBadge = preferences.personaBadge || '💎 HODLer'

    // Fetch quick sections + authenticated user votes in parallel (fast, non-blocking)
    const [coins, news, meme, userVotes] = await Promise.all([
      coingeckoService.getCoinPrices(assets),
      marketNewsService.getMarketNews(),
      memeService.getRandomMeme(),
      feedbackService.getUserVotes(userId)
    ])

    return {
      persona,
      personaBadge,
      assets,
      content: preferences.content || ['Market News', 'Price Charts', 'AI Insights', 'Memes & Culture'],
      sections: {
        coins: {
          items: coins,
          userVote: userVotes.coins || null
        },
        news: {
          items: news,
          userVote: userVotes.news || null
        },
        aiInsight: {
          data: null, // Decoupled: loaded asynchronously by client to prevent blocking
          userVote: userVotes.aiInsight || null
        },
        meme: {
          data: meme,
          userVote: userVotes.meme || null
        }
      },
      userVotes,
      updatedAt: new Date().toISOString()
    }
  } catch (err) {
    logger.error('Failed to compile daily dashboard', err)
    throw err
  }
}

async function getAiInsight({ persona, assets }) {
  return await aiService.generateDailyInsight({
    persona: persona || 'HODLer',
    assets: assets?.length ? assets : ['BTC', 'ETH', 'SOL']
  })
}

async function getNextMeme(currentMemeId) {
  return await memeService.getRandomMeme(currentMemeId)
}

async function regenerateAiInsight({ persona, assets }) {
  return await aiService.generateDailyInsight({
    persona: persona || 'HODLer',
    assets: assets?.length ? assets : ['BTC', 'ETH', 'SOL']
  })
}


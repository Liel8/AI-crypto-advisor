import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const feedbackService = {
  recordVote,
  getUserVotes,
  getVotesSummary
}

const COLLECTION_NAME = 'feedback'

async function recordVote({ userId, section, vote, persona = 'HODLer' }) {
  if (!userId || userId === 'guest') {
    throw new Error('Valid authenticated userId is required to record feedback')
  }
  if (!['coins', 'news', 'aiInsight', 'meme'].includes(section)) {
    throw new Error('Invalid section')
  }
  if (!['up', 'down'].includes(vote)) {
    throw new Error('Invalid vote type')
  }

  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const filter = { userId: userId.toString(), section }
    const update = {
      $set: {
        vote,
        persona,
        updatedAt: new Date().toISOString()
      },
      $setOnInsert: {
        createdAt: new Date().toISOString()
      }
    }

    await collection.updateOne(filter, update, { upsert: true })
    logger.info(`Feedback recorded: ${vote} for ${section} by user ${userId}`)

    const userVotes = await getUserVotes(userId)
    return {
      success: true,
      section,
      userVote: vote,
      userVotes
    }
  } catch (err) {
    logger.error('Failed to record feedback vote', err)
    throw err
  }
}

async function getUserVotes(userId) {
  const defaultVotes = {
    coins: null,
    news: null,
    aiInsight: null,
    meme: null
  }

  if (!userId) return defaultVotes

  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const docs = await collection.find({ userId: userId.toString() }).toArray()

    const userVotes = { ...defaultVotes }
    docs.forEach(doc => {
      if (doc.section && (doc.vote === 'up' || doc.vote === 'down')) {
        userVotes[doc.section] = doc.vote
      }
    })

    return userVotes
  } catch (err) {
    logger.error('Failed to fetch user votes for ' + userId, err)
    return defaultVotes
  }
}

async function getVotesSummary() {
  const zeroVotes = {
    coins: { up: 0, down: 0 },
    news: { up: 0, down: 0 },
    aiInsight: { up: 0, down: 0 },
    meme: { up: 0, down: 0 }
  }

  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const allVotes = await collection.find()
    const votesArray = Array.isArray(allVotes) ? allVotes : await allVotes.toArray()

    const summary = {
      coins: { up: 0, down: 0 },
      news: { up: 0, down: 0 },
      aiInsight: { up: 0, down: 0 },
      meme: { up: 0, down: 0 }
    }

    votesArray.forEach(v => {
      if (summary[v.section]) {
        if (v.vote === 'up') summary[v.section].up++
        if (v.vote === 'down') summary[v.section].down++
      }
    })

    return summary
  } catch (err) {
    logger.warn('Error reading votes from MongoDB, returning zero votes:', err.message)
    return zeroVotes
  }
}

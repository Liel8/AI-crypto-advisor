import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const userService = {
  getById,
  getByEmail,
  add,
  updatePreferences
}

const COLLECTION_NAME = 'users'

async function getById(userId) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    const id =
      typeof userId === 'string' && ObjectId.isValid(userId)
        ? new ObjectId(userId)
        : userId

    const user = await collection.findOne({ _id: id })

    if (user) {
      delete user.password
    }

    return user
  } catch (err) {
    logger.error(`while finding user by id: ${userId}`, err)
    throw err
  }
}

async function getByEmail(email) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    return await collection.findOne({ email: email.toLowerCase() })
  } catch (err) {
    logger.error(`while finding user by email: ${email}`, err)
    throw err
  }
}

async function add(user) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    const userToAdd = {
      ...user,
      email: user.email.toLowerCase()
    }

    const res = await collection.insertOne(userToAdd)
    if (!userToAdd._id && res?.insertedId) {
      userToAdd._id = res.insertedId
    }

    return userToAdd
  } catch (err) {
    logger.error('cannot add user', err)
    throw err
  }
}

async function updatePreferences(
  userId,
  { assets, persona, personaBadge, content }
) {
  try {
    if (!Array.isArray(assets) || assets.length === 0) {
      throw new Error('At least one crypto asset is required')
    }
    if (!Array.isArray(content) || content.length === 0) {
      throw new Error('At least one content type is required')
    }

    const collection = await dbService.getCollection(COLLECTION_NAME)

    const id =
      typeof userId === 'string' && ObjectId.isValid(userId)
        ? new ObjectId(userId)
        : userId

    const updateData = {
      preferences: {
        assets: assets,
        persona: persona || 'HODLer',
        personaBadge: personaBadge || '💎 HODLer',
        content: content
      },
      hasCompletedOnboarding: true
    }

    await collection.updateOne(
      { _id: id },
      { $set: updateData }
    )

    return await getById(id)
  } catch (err) {
    logger.error(`cannot update preferences for user ${userId}`, err)
    throw err
  }
}
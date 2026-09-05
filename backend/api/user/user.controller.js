import { userService } from './user.service.js'
import { logger } from '../../services/logger.service.js'

export async function getUser(req, res) {
  try {
    const { id } = req.params
    const loggedinUserId = req.loggedinUser?._id

    if (!loggedinUserId || String(id) !== String(loggedinUserId)) {
      return res.status(403).send({ err: 'Forbidden: Cannot access other users data' })
    }

    const user = await userService.getById(id)
    if (!user) return res.status(404).send({ err: 'User not found' })

    const { password, ...safeUser } = user
    res.send(safeUser)
  } catch (err) {
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

export async function updatePreferences(req, res) {
  try {
    const userId = req.loggedinUser?._id
    if (!userId) {
      return res.status(401).send({ err: 'Authentication required' })
    }

    const { assets, content } = req.body
    if (!Array.isArray(assets) || assets.length === 0) {
      return res.status(400).send({ err: 'At least one crypto asset is required' })
    }
    if (!Array.isArray(content) || content.length === 0) {
      return res.status(400).send({ err: 'At least one content type is required' })
    }

    const updatedUser = await userService.updatePreferences(userId, req.body)
    if (updatedUser) {
      delete updatedUser.password
    }
    res.send(updatedUser)
  } catch (err) {
    logger.error('Failed to update preferences', err)
    res.status(500).send({ err: 'Failed to update preferences' })
  }
}

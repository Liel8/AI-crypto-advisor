import { logger } from '../services/logger.service.js'

export async function log(req, res, next) {
  logger.info(`Incoming ${req.method} request to: ${req.originalUrl}`)
  next()
}

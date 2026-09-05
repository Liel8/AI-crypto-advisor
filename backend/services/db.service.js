import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'
import { logger } from './logger.service.js'

export const dbService = {
  getCollection
}

let dbConn = null

async function getCollection(collectionName) {
  try {
    const db = await _connect()
    return db.collection(collectionName)
  } catch (err) {
    logger.error(`Failed to get Mongo collection: ${collectionName}`, err)
    throw err
  }
}

async function _connect() {
  if (dbConn) return dbConn
  try {
    const client = await MongoClient.connect(config.dbURL)
    dbConn = client.db(config.dbName)
    logger.info(`Successfully connected to MongoDB: ${config.dbName}`)
    return dbConn
  } catch (err) {
    logger.error('Cannot connect to MongoDB Atlas', err.message)
    throw new Error(`Cannot connect to MongoDB Atlas: ${err.message}`)
  }
}

import { dbConnect } from './db'
import { logger } from './logger'
import { User } from './db/models'
import type { Mongoose } from 'mongoose'

export async function monitorDatabase() {
  try {
    // Monitor database health
    await dbConnect()
    const result = await User.findOne().limit(1)
    logger.info('Database health check passed')
  } catch (error) {
    logger.error('Database health check failed:', error)
  }
}

export async function monitorConnections() {
  try {
    // Get MongoDB connection stats
    const conn = await dbConnect() as Mongoose
    if (!conn.connection.db) {
      throw new Error('Database connection not established')
    }
    
    const stats = await conn.connection.db.stats()
    logger.info('MongoDB connection stats:', {
      collections: stats.collections,
      objects: stats.objects,
      avgObjSize: stats.avgObjSize,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize
    })
  } catch (error) {
    logger.error('Failed to get connection metrics:', error)
  }
}

export async function monitorPerformance() {
  try {
    // Track query performance
    const start = Date.now()
    await User.findOne().limit(1)
    const duration = Date.now() - start
    logger.info(`Query duration: ${duration}ms`)
  } catch (error) {
    logger.error('Performance monitoring failed:', error)
  }
} 
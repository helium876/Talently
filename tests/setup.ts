import mongoose from 'mongoose'
import { execSync } from 'child_process'
import { join } from 'path'
import { Page } from '@playwright/test'
import { logger } from '@/lib/logger'
import { User, Business, Talent, Booking } from '@/lib/db/models'

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/talently_test'

// Reset database before tests
export async function setupTestDatabase() {
  try {
    logger.info('Setting up test database...')
    
    // Connect to test database
    const conn = await mongoose.connect(TEST_MONGODB_URI)
    if (!conn.connection.db) {
      throw new Error('Test database connection not established')
    }

    // Drop all collections
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Talent.deleteMany({}),
      Booking.deleteMany({})
    ])

    logger.info('Test database has been reset')
  } catch (error) {
    logger.error('Error setting up test database:', error as Error)
    throw error
  }
}

// Safe cleanup function
export async function safeCleanup() {
  try {
    logger.info('Starting safe cleanup...')
    
    // Delete in correct order
    await Promise.all([
      Booking.deleteMany({}),
      Talent.deleteMany({}),
      Business.deleteMany({}),
      User.deleteMany({})
    ])

    logger.info('Cleanup completed successfully')
  } catch (error) {
    logger.error('Error during cleanup:', error as Error)
    throw error
  } finally {
    await mongoose.disconnect()
  }
}

// Auto-fix helper functions
export async function autoFixDatabase() {
  try {
    logger.info('Starting database auto-fix...')
    
    // Check if collections exist
    const conn = await mongoose.connect(TEST_MONGODB_URI)
    if (!conn.connection.db) {
      throw new Error('Database connection not established')
    }
    
    const collections = await conn.connection.db.collections()
    const collectionNames = collections.map(c => c.collectionName)
    const requiredCollections = ['users', 'businesses', 'talents', 'bookings']
    
    const missingCollections = requiredCollections.filter(
      name => !collectionNames.includes(name)
    )

    if (missingCollections.length > 0) {
      logger.warn('Missing collections detected:', { collections: missingCollections })
      await setupTestDatabase()
    }
    
    logger.info('Database auto-fix completed successfully')
  } catch (error) {
    logger.error('Error during database auto-fix:', error as Error)
    throw error
  }
}

// Wait for server to be ready with improved error handling
export async function waitForServer(
  page: Page, 
  { maxAttempts = 5, interval = 2000 } = {}
): Promise<void> {
  logger.info('Waiting for server to be ready...')
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await page.goto('/', { timeout: 10000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 })
      logger.info('Server is ready')
      return
    } catch (error) {
      if (attempt === maxAttempts) {
        logger.error('Server failed to start:', error as Error)
        throw new Error('Server failed to start after multiple attempts')
      }
      logger.warn(`Server not ready (attempt ${attempt}/${maxAttempts}), retrying...`)
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
}

// Ensure cleanup after all tests
process.on('beforeExit', async () => {
  try {
    await safeCleanup()
  } catch (error) {
    logger.error('Error during final cleanup:', error as Error)
    process.exit(1)
  }
}) 
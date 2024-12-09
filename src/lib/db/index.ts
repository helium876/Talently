import mongoose from 'mongoose'
import config from '../config'
import { logger } from '../monitoring/logger'

const MONGODB_URI = config.database.uri

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

/**
 * Connects to MongoDB and returns the connection
 * @returns The mongoose connection
 */
export async function dbConnect() {
  // Skip DB connection during static page generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    logger.info('Skipping DB connection during build')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: config.database.options.bufferCommands,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        logger.info('Connected to MongoDB')
        return mongoose
      })
      .catch((error) => {
        logger.error('Error connecting to MongoDB:', error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Mongoose event handlers
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established')
})

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection disconnected')
})

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    logger.info('MongoDB connection closed through app termination')
    process.exit(0)
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err)
    process.exit(1)
  }
})

// Export mongoose instance and connection function
export { mongoose }
export default dbConnect 
import { dbConnect } from './db'
import { logger } from './logger'
import { hashPassword } from './auth'
import { User, Business, Talent, Booking } from './db/models'

export async function autoFix() {
  try {
    await dbConnect()
    await fixOrphanedRecords()
    await fixUnhashedPasswords()
    await fixInvalidStatuses()
    await cleanupExpiredSessions()
    logger.info('Auto-fix completed successfully')
  } catch (error) {
    logger.error('Auto-fix failed:', error)
  }
}

async function fixOrphanedRecords() {
  // Delete orphaned talents
  await Talent.deleteMany({
    businessId: { 
      $nin: await Business.find().distinct('_id')
    }
  })

  // Delete orphaned bookings
  await Booking.deleteMany({
    talentId: { 
      $nin: await Talent.find().distinct('_id')
    }
  })
}

async function fixUnhashedPasswords() {
  const users = await User.find({
    password: { $not: /^\$2[ayb]\$.{56}$/ }
  })

  for (const user of users) {
    user.password = await hashPassword(user.password)
    await user.save()
  }
}

async function fixInvalidStatuses() {
  await Booking.updateMany(
    { status: { $nin: ['PENDING', 'CONFIRMED', 'CANCELLED'] } },
    { $set: { status: 'PENDING' } }
  )

  await Talent.updateMany(
    { status: { $nin: ['ACTIVE', 'INACTIVE', 'FEATURED'] } },
    { $set: { status: 'INACTIVE' } }
  )
}

async function cleanupExpiredSessions() {
  // MongoDB doesn't need session cleanup as we're using JWT
  logger.info('Session cleanup not needed for JWT authentication')
}
 
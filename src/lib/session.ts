'use server'

import { cookies } from 'next/headers'
import { Business } from './db/models'
import { connectToDatabase } from './db'
import { SerializedBusiness } from './types/data'
import { safeSerialize } from './utils'

export async function getSession(): Promise<SerializedBusiness | null> {
  try {
    const sessionId = cookies().get('session')?.value
    if (!sessionId) return null

    await connectToDatabase()
    const business = await Business.findById(sessionId)
      .populate('talents')
      .populate('bookings')
      .exec()

    if (!business) {
      cookies().delete('session')
      return null
    }

    return safeSerialize<SerializedBusiness>(business)
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export { getSession as getServerSession }
 
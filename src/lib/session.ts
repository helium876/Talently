'use server'

import { cookies } from 'next/headers'
import { Business } from './db/models'
import { connectToDatabase } from './db'
import { SerializedBusiness } from './types/data'

export async function getSession(): Promise<SerializedBusiness | null> {
  try {
    const sessionId = cookies().get('session')?.value
    if (!sessionId) return null

    await connectToDatabase()
    const business = await Business.findById(sessionId)
    if (!business) {
      cookies().delete('session')
      return null
    }

    return {
      id: business._id.toString(),
      name: business.name,
      email: business.email,
      logoPath: business.logoPath || null,
      emailPreferences: business.emailPreferences || {
        marketingEmails: false,
        bookingNotifications: true,
        weeklyDigest: false
      },
      createdAt: business.createdAt?.toISOString() || null,
      updatedAt: business.updatedAt?.toISOString() || null
    }
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

export async function getBusinessById(id: string): Promise<SerializedBusiness | null> {
  try {
    await connectToDatabase()
    const business = await Business.findById(id)
    if (!business) return null

    return {
      id: business.id,
      name: business.name,
      email: business.email,
      logoPath: business.logoPath || null,
      emailPreferences: business.emailPreferences || {
        marketingEmails: false,
        bookingNotifications: true,
        weeklyDigest: false
      },
      createdAt: business.createdAt?.toISOString() || null,
      updatedAt: business.updatedAt?.toISOString() || null
    }
  } catch (error) {
    console.error('Get business error:', error)
    return null
  }
} 
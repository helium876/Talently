'use server'

import { cookies } from 'next/headers'
import { Business } from './db/models'
import { connectToDatabase } from './db'
import { IBusiness } from './types/models'
import { SerializedBusiness } from './types/data'
import { serializeMongooseObject } from './utils'

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
      createdAt: business.createdAt?.toISOString() || null,
      updatedAt: business.updatedAt?.toISOString() || null
    }
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function requireAuth(): Promise<SerializedBusiness> {
  const business = await getSession()
  if (!business) {
    throw new Error('Authentication required')
  }
  return business
}

export async function getCurrentBusiness(): Promise<SerializedBusiness | null> {
  try {
    const business = await getSession()
    if (!business) return null

    return {
      id: business.id,
      name: business.name,
      email: business.email,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt
    }
  } catch (error) {
    console.error('Get current business error:', error)
    return null
  }
} 
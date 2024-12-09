'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Business } from '../db/models'
import { logger } from '../monitoring/logger'
import config from '../config'
import { signJWT, verifyJWT } from '../security/jwt'

export async function login(email: string, password: string) {
  try {
    const business = await Business.findOne({ email })
    if (!business) {
      return { error: 'Invalid credentials' }
    }

    const isValid = await business.comparePassword(password)
    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    // Create session token
    const token = await signJWT({ sub: business.id })

    // Set cookie
    cookies().set(config.security.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    logger.info('Business logged in', { businessId: business.id })
    return { success: true }
  } catch (error) {
    logger.error('Error during login', { error })
    return { error: 'An error occurred during login' }
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    // Check if business already exists
    const existingBusiness = await Business.findOne({ email })
    if (existingBusiness) {
      return { error: 'Email already registered' }
    }

    // Create new business
    const business = new Business({
      name,
      email,
      password,
    })
    await business.save()

    // Create session token
    const token = await signJWT({ sub: business.id })

    // Set cookie
    cookies().set(config.security.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    logger.info('Business signed up', { businessId: business.id })
    return { success: true }
  } catch (error) {
    logger.error('Error during signup', { error })
    return { error: 'An error occurred during signup' }
  }
}

export async function logout() {
  try {
    cookies().delete(config.security.sessionCookieName)
    logger.info('Business logged out')
    redirect('/login')
  } catch (error) {
    logger.error('Error during logout', { error })
    return { error: 'An error occurred during logout' }
  }
}

export async function getSession() {
  try {
    const token = cookies().get(config.security.sessionCookieName)?.value
    if (!token) return null

    const payload = await verifyJWT(token)
    if (!payload?.sub) return null

    const business = await Business.findById(payload.sub)
    if (!business) {
      cookies().delete(config.security.sessionCookieName)
      return null
    }

    // Return a plain object without Mongoose internals
    return {
      id: business._id.toString(),
      name: business.name,
      email: business.email,
      logoPath: business.logoPath,
      emailPreferences: business.emailPreferences,
    }
  } catch (error) {
    logger.error('Error getting session', { error })
    cookies().delete(config.security.sessionCookieName)
    return null
  }
}

export async function updateProfile(
  businessId: string,
  data: {
    name?: string
    email?: string
    password?: string
    logoPath?: string
    emailPreferences?: {
      marketingEmails?: boolean
      bookingNotifications?: boolean
      weeklyDigest?: boolean
    }
  }
) {
  try {
    const business = await Business.findById(businessId)
    if (!business) {
      return { error: 'Business not found' }
    }

    // Update fields
    if (data.name) business.name = data.name
    if (data.email) business.email = data.email
    if (data.password) business.password = data.password
    if (data.logoPath) business.logoPath = data.logoPath
    if (data.emailPreferences) {
      business.emailPreferences = {
        ...business.emailPreferences,
        ...data.emailPreferences,
      }
    }

    await business.save()
    logger.info('Business profile updated', { businessId })
    return { success: true }
  } catch (error) {
    logger.error('Error updating profile', { error, businessId })
    return { error: 'An error occurred while updating profile' }
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { getErrorMessage } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const business = await requireAuth()
    
    if (!business) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    logger.info('Profile fetched successfully', { businessId: business.id })
    return NextResponse.json(business)
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    logger.error('Error fetching profile', { error: errorMessage })
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 
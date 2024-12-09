import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await dbConnect()

    const health = {
      status: 'healthy',
      details: {
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    const health = {
      status: 'unhealthy',
      details: {
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    }

    return NextResponse.json(health, { status: 503 })
  }
} 
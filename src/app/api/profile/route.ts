import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/actions/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error('Error getting session:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { name, emailPreferences } = await request.json()

    // Basic validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // TODO: Implement actual profile update
    // For now, just return success with updated data
    const user = {
      id: '1',
      name,
      email: 'demo@example.com',
      emailPreferences,
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'An error occurred during profile update' },
      { status: 500 }
    )
  }
} 
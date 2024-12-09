import { NextResponse } from 'next/server'

export async function GET() {
  // Basic dashboard statistics for demonstration
  const stats = {
    totalTalents: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0,
  }

  return NextResponse.json(stats)
} 
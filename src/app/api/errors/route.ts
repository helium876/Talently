import { NextResponse } from 'next/server'

export async function GET() {
  // Basic error statistics for demonstration
  const errors = {
    total: 0,
    categories: {
      api: {
        count: 0,
        lastOccurred: null,
      },
      database: {
        count: 0,
        lastOccurred: null,
      },
      authentication: {
        count: 0,
        lastOccurred: null,
      },
    },
    lastError: null,
  }

  return NextResponse.json(errors)
} 
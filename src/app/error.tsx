'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our logging service
    logger.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Something went wrong!</h1>
        <p className="mt-4 text-lg text-gray-600">
          We've logged the error and will look into it.
        </p>
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-4 p-4 bg-red-50 rounded-md text-left">
            <p className="text-red-700 text-sm font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-red-500 text-xs mt-1">Error ID: {error.digest}</p>
            )}
          </div>
        )}
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 
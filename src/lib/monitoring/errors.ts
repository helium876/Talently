import { logger } from './logger'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT', 429)
    this.name = 'RateLimitError'
  }
}

/**
 * Error handler for API routes
 * @param error - The error to handle
 * @returns The error response
 */
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    logger.warn(error.message, { error })
    return new Response(JSON.stringify(error.toJSON()), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  logger.error('Unhandled error', { error })
  return new Response(
    JSON.stringify({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

/**
 * Error handler for server actions
 * @param error - The error to handle
 * @returns The error response
 */
export function handleActionError(error: unknown) {
  if (error instanceof AppError) {
    logger.warn(error.message, { error })
    return { error: error.message }
  }

  logger.error('Unhandled error', { error })
  return { error: 'An unexpected error occurred' }
}

/**
 * Wraps an async function with error handling
 * @param fn - The function to wrap
 * @returns The wrapped function
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error('Unhandled error in wrapped function', { error })
      throw new AppError(
        'An unexpected error occurred',
        'INTERNAL_SERVER_ERROR'
      )
    }
  }
}

/**
 * Creates an error boundary component
 * @param fallback - The fallback UI to show when an error occurs
 * @returns The error boundary component
 */
export function createErrorBoundary(fallback: React.ReactNode) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
      return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logger.error('React error boundary caught error', {
        error,
        componentStack: errorInfo.componentStack,
      })
    }

    render() {
      if (this.state.hasError) {
        return fallback
      }
      return this.props.children
    }
  }
}

/**
 * Checks if an error is an instance of AppError
 * @param error - The error to check
 * @returns Whether the error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Gets a user-friendly error message
 * @param error - The error to get the message from
 * @returns The error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
} 
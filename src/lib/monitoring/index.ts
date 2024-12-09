import { logger } from './logger'
import { AppError } from './errors'

// Performance metrics
const metrics = new Map<string, {
  count: number
  totalDuration: number
  maxDuration: number
  minDuration: number
}>()

/**
 * Records a metric value
 * @param name - The name of the metric
 * @param value - The value to record
 */
export function recordMetric(name: string, value: number) {
  const metric = metrics.get(name) || {
    count: 0,
    totalDuration: 0,
    maxDuration: -Infinity,
    minDuration: Infinity,
  }

  metric.count++
  metric.totalDuration += value
  metric.maxDuration = Math.max(metric.maxDuration, value)
  metric.minDuration = Math.min(metric.minDuration, value)

  metrics.set(name, metric)
}

/**
 * Gets metrics for a specific metric name
 * @param name - The name of the metric
 * @returns The metric statistics
 */
export function getMetrics(name: string) {
  const metric = metrics.get(name)
  if (!metric) return null

  return {
    count: metric.count,
    average: metric.totalDuration / metric.count,
    max: metric.maxDuration,
    min: metric.minDuration,
  }
}

/**
 * Gets all metrics
 * @returns All metric statistics
 */
export function getAllMetrics() {
  const result: Record<string, ReturnType<typeof getMetrics>> = {}
  for (const [name] of metrics) {
    result[name] = getMetrics(name)
  }
  return result
}

/**
 * Clears all metrics
 */
export function clearMetrics() {
  metrics.clear()
}

// Request tracking
const requests = new Map<string, {
  startTime: number
  path: string
  method: string
}>()

/**
 * Starts tracking a request
 * @param requestId - The request ID
 * @param path - The request path
 * @param method - The request method
 */
export function startRequest(requestId: string, path: string, method: string) {
  requests.set(requestId, {
    startTime: performance.now(),
    path,
    method,
  })
}

/**
 * Ends tracking a request
 * @param requestId - The request ID
 */
export function endRequest(requestId: string) {
  const request = requests.get(requestId)
  if (!request) return

  const duration = performance.now() - request.startTime
  recordMetric(`request.${request.method}.${request.path}`, duration)
  requests.delete(requestId)
}

// Error tracking
const errors = new Map<string, {
  count: number
  lastOccurred: number
  samples: Array<{
    message: string
    stack?: string
    timestamp: number
  }>
}>()

/**
 * Records an error
 * @param error - The error to record
 */
export function recordError(error: unknown) {
  const errorName = error instanceof Error ? error.constructor.name : 'UnknownError'
  const errorData = errors.get(errorName) || {
    count: 0,
    lastOccurred: 0,
    samples: [],
  }

  errorData.count++
  errorData.lastOccurred = Date.now()

  // Keep last 10 samples
  if (error instanceof Error) {
    errorData.samples.unshift({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    })
    if (errorData.samples.length > 10) {
      errorData.samples.pop()
    }
  }

  errors.set(errorName, errorData)

  // Log the error
  if (error instanceof AppError) {
    logger.warn('Application error occurred', { error })
  } else {
    logger.error('Unexpected error occurred', { error })
  }
}

/**
 * Gets error statistics
 * @returns Error statistics
 */
export function getErrorStats() {
  const result: Record<string, {
    count: number
    lastOccurred: number
    samples: Array<{
      message: string
      stack?: string
      timestamp: number
    }>
  }> = {}

  for (const [name, data] of errors) {
    result[name] = { ...data }
  }

  return result
}

/**
 * Clears error statistics
 */
export function clearErrorStats() {
  errors.clear()
}

// Health check
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  details: {
    uptime: number
    memory: {
      used: number
      total: number
      percentage: number
    }
    errors: {
      total: number
      lastMinute: number
    }
    requests: {
      total: number
      averageResponseTime: number
    }
  }
}

/**
 * Gets the current health status
 * @returns The health status
 */
export function getHealthStatus(): HealthStatus {
  const totalErrors = Array.from(errors.values()).reduce(
    (sum, error) => sum + error.count,
    0
  )

  const lastMinuteErrors = Array.from(errors.values()).reduce(
    (sum, error) => sum + (
      error.lastOccurred > Date.now() - 60000 ? 1 : 0
    ),
    0
  )

  const memoryUsage = process.memoryUsage()
  const totalMemory = memoryUsage.heapTotal
  const usedMemory = memoryUsage.heapUsed
  const memoryPercentage = (usedMemory / totalMemory) * 100

  const requestMetrics = getAllMetrics()
  const totalRequests = Object.values(requestMetrics).reduce(
    (sum, metric) => sum + (metric?.count || 0),
    0
  )
  const totalDuration = Object.values(requestMetrics).reduce(
    (sum, metric) => sum + (metric?.average || 0) * (metric?.count || 0),
    0
  )
  const averageResponseTime = totalRequests ? totalDuration / totalRequests : 0

  // Determine status based on metrics
  let status: HealthStatus['status'] = 'healthy'
  if (lastMinuteErrors > 0 || memoryPercentage > 90) {
    status = 'degraded'
  }
  if (lastMinuteErrors > 10 || memoryPercentage > 95) {
    status = 'unhealthy'
  }

  return {
    status,
    details: {
      uptime: process.uptime(),
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage,
      },
      errors: {
        total: totalErrors,
        lastMinute: lastMinuteErrors,
      },
      requests: {
        total: totalRequests,
        averageResponseTime,
      },
    },
  }
}

// Export everything from errors and logger
export * from './errors'
export * from './logger' 
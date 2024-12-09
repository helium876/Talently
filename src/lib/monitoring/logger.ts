import config from '../config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',  // Reset
}

class Logger {
  private level: LogLevel

  constructor() {
    this.level = (config.monitoring.logLevel || 'info') as LogLevel
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
  }

  private formatMessage(entry: LogEntry): string {
    const color = COLORS[entry.level]
    const reset = COLORS.reset
    const prefix = `${color}[${entry.level.toUpperCase()}]${reset}`
    const timestamp = `[${entry.timestamp}]`
    let message = `${prefix} ${timestamp} ${entry.message}`

    if (entry.data) {
      if (entry.data instanceof Error) {
        message += `\n${entry.data.stack || entry.data.message}`
      } else {
        try {
          const data = JSON.stringify(entry.data, null, 2)
          message += `\n${data}`
        } catch {
          message += `\n${entry.data}`
        }
      }
    }

    return message
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    }

    const formattedMessage = this.formatMessage(entry)

    switch (level) {
      case 'debug':
        console.debug(formattedMessage)
        break
      case 'info':
        console.info(formattedMessage)
        break
      case 'warn':
        console.warn(formattedMessage)
        break
      case 'error':
        console.error(formattedMessage)
        break
    }

    // Here you could add additional logging targets:
    // - File logging
    // - Error reporting service
    // - Metrics collection
    // - etc.
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  setLevel(level: LogLevel) {
    this.level = level
  }

  /**
   * Creates a child logger with additional context
   * @param context - The context to add to all logs
   * @returns A new logger instance with the added context
   */
  child(context: Record<string, unknown>) {
    const childLogger = new Logger()
    childLogger.setLevel(this.level)

    const methods: LogLevel[] = ['debug', 'info', 'warn', 'error']
    methods.forEach(method => {
      const originalMethod = childLogger[method].bind(childLogger)
      childLogger[method] = (message: string, data?: unknown) => {
        originalMethod(message, data ? { ...context, ...(data as object) } : context)
      }
    })

    return childLogger
  }

  /**
   * Logs the duration of an async operation
   * @param name - The name of the operation
   * @param operation - The async operation to measure
   * @returns The result of the operation
   */
  async time<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await operation()
      const duration = performance.now() - start
      this.info(`${name} completed`, { duration: `${duration.toFixed(2)}ms` })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.error(`${name} failed`, { error, duration: `${duration.toFixed(2)}ms` })
      throw error
    }
  }
}

// Export a singleton instance
export const logger = new Logger() 
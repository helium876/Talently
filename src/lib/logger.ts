type LogLevel = 'info' | 'warn' | 'error'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

class Logger {
  private logs: LogMessage[] = []
  private maxLogs = 1000

  private createLogMessage(level: LogLevel, message: string, data?: unknown): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    }
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const logMessage = this.createLogMessage(level, message, data)
    this.logs.push(logMessage)

    // Trim logs if they exceed maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // In development, also log to console
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
      consoleMethod(`[${level.toUpperCase()}] ${message}`, data || '')
    }
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error)
  }

  getLogs(): LogMessage[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger() 
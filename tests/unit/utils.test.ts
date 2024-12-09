import { describe, expect, test, beforeEach } from '@jest/globals'
import { logger } from '@/lib/logger'
import { AppError, ValidationError, AuthenticationError } from '@/lib/errors'
import { cn } from '@/lib/utils'

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs()
  })

  test('should log messages with correct levels', () => {
    logger.debug('Debug message')
    logger.info('Info message')
    logger.warn('Warning message')
    logger.error('Error message')

    const logs = logger.getRecentLogs()
    expect(logs).toHaveLength(4)
    expect(logs[0].level).toBe('debug')
    expect(logs[1].level).toBe('info')
    expect(logs[2].level).toBe('warn')
    expect(logs[3].level).toBe('error')
  })

  test('should include context in logs', () => {
    const context = { userId: '123', action: 'test' }
    logger.info('Test message', context)

    const logs = logger.getRecentLogs()
    expect(logs[0].context).toEqual(context)
  })

  test('should format errors correctly', () => {
    const error = new Error('Test error')
    logger.error('Error occurred', error)

    const logs = logger.getRecentLogs()
    expect(logs[0].error).toBeDefined()
    expect(logs[0].error?.message).toBe('Test error')
  })

  test('should maintain buffer size limit', () => {
    for (let i = 0; i < 150; i++) {
      logger.info(`Message ${i}`)
    }

    const logs = logger.getRecentLogs()
    expect(logs.length).toBeLessThanOrEqual(100)
  })
})

describe('Error Classes', () => {
  test('AppError should have correct properties', () => {
    const error = new AppError('Test error', 400, 'TEST_ERROR')
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe('TEST_ERROR')
    expect(error.isOperational).toBe(true)
  })

  test('ValidationError should extend AppError', () => {
    const error = new ValidationError('Invalid input')
    expect(error).toBeInstanceOf(AppError)
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe('VALIDATION_ERROR')
  })

  test('AuthenticationError should extend AppError', () => {
    const error = new AuthenticationError()
    expect(error).toBeInstanceOf(AppError)
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe('AUTHENTICATION_ERROR')
  })
})

describe('Utility Functions', () => {
  test('cn should merge class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
    expect(cn('btn', { 'btn-active': true, 'btn-disabled': false }))
      .toBe('btn btn-active')
    expect(cn('btn', undefined, null, 'btn-lg'))
      .toBe('btn btn-lg')
  })
}) 
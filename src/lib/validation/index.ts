import { z } from 'zod'
import { logger } from '../monitoring/logger'

export * from './schemas'

interface ValidationError {
  path: string
  message: string
}

interface ValidationSuccess<T> {
  success: true
  data: T
}

interface ValidationFailure {
  success: false
  errors: ValidationError[]
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

/**
 * Validates data against a schema and returns the result
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validation result
 */
export async function validate<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    const result = await schema.safeParseAsync(data)
    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        path: error.path.join('.'),
        message: error.message,
      }))
      return {
        success: false,
        errors,
      }
    }
    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    logger.error('Validation error', { error })
    return {
      success: false,
      errors: [{ path: 'unknown', message: 'An error occurred during validation' }],
    }
  }
}

/**
 * Validates data against a schema and throws an error if validation fails
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated data
 */
export async function validateOrThrow<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<T> {
  const result = await validate(schema, data)
  if (!result.success) {
    throw new Error(
      result.errors
        .map(error => `${error.path}: ${error.message}`)
        .join(', ')
    )
  }
  return result.data
}

/**
 * Validates form data against a schema
 * @param schema - The Zod schema to validate against
 * @param formData - The form data to validate
 * @returns The validation result
 */
export async function validateForm<T>(
  schema: z.Schema<T>,
  formData: FormData
): Promise<ValidationResult<T>> {
  const data = Object.fromEntries(formData.entries())
  return validate(schema, data)
}

/**
 * Validates query parameters against a schema
 * @param schema - The Zod schema to validate against
 * @param query - The query parameters to validate
 * @returns The validation result
 */
export async function validateQuery<T>(
  schema: z.Schema<T>,
  query: Record<string, string | string[]>
): Promise<ValidationResult<T>> {
  const data = Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  )
  return validate(schema, data)
}

/**
 * Creates a validation middleware for API routes
 * @param schema - The Zod schema to validate against
 * @returns The validation middleware
 */
export function createValidationMiddleware<T>(schema: z.Schema<T>) {
  return async (req: Request): Promise<ValidationResult<T>> => {
    const contentType = req.headers.get('content-type')
    let data: unknown

    if (contentType?.includes('application/json')) {
      data = await req.json()
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData()
      data = Object.fromEntries(formData.entries())
    } else {
      return {
        success: false,
        errors: [{ path: 'content-type', message: 'Unsupported content type' }],
      }
    }

    return validate(schema, data)
  }
}

/**
 * Creates a validation handler for server actions
 * @param schema - The Zod schema to validate against
 * @param handler - The server action handler
 * @returns The validated server action
 */
export function createValidatedAction<T, R>(
  schema: z.Schema<T>,
  handler: (data: T) => Promise<R>
) {
  return async (formData: FormData): Promise<{ error: string } | R> => {
    const result = await validateForm(schema, formData)
    if (!result.success) {
      return { error: result.errors[0].message }
    }
    return handler(result.data)
  }
} 
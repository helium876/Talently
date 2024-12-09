import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const talentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  basicInfo: z.string().min(10, 'Basic info must be at least 10 characters'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'FEATURED']).default('ACTIVE'),
  businessId: z.string(),
  imagePath: z.string().nullable().optional()
})

export const bookingSchema = z.object({
  businessId: z.string(),
  talentId: z.string(),
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid client email'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).default('PENDING'),
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().nullable().optional()
})

export type BusinessFormData = z.infer<typeof businessSchema>
export type TalentFormData = z.infer<typeof talentSchema>
export type BookingFormData = z.infer<typeof bookingSchema>

export type ValidationError = {
  field: string
  message: string
}

export function validateBusinessName(name: string): { isValid: boolean; errors: ValidationError[] } {
  try {
    businessSchema.shape.name.parse(name)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          field: 'name',
          message: err.message
        }))
      }
    }
    return {
      isValid: false,
      errors: [{ field: 'name', message: 'Invalid business name' }]
    }
  }
}

export function validatePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (!currentPassword) {
    errors.push({
      field: 'currentPassword',
      message: 'Current password is required'
    })
  }

  try {
    businessSchema.shape.password.parse(newPassword)
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(err => ({
        field: 'newPassword',
        message: err.message
      })))
    }
  }

  if (newPassword !== confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateFileUpload(file: File): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

  if (file.size > maxSize) {
    errors.push({
      field: 'file',
      message: 'File size must be less than 5MB'
    })
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: 'File must be an image (JPEG, PNG, or GIF)'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export interface EmailPreferencesData {
  marketingEmails: boolean
  bookingNotifications: boolean
  weeklyDigest: boolean
}

export function validateEmailPreferences(
  data: Partial<EmailPreferencesData>
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (typeof data.marketingEmails !== 'boolean') {
    errors.push({
      field: 'marketingEmails',
      message: 'Marketing emails preference must be a boolean'
    })
  }

  if (typeof data.bookingNotifications !== 'boolean') {
    errors.push({
      field: 'bookingNotifications',
      message: 'Booking notifications preference must be a boolean'
    })
  }

  if (typeof data.weeklyDigest !== 'boolean') {
    errors.push({
      field: 'weeklyDigest',
      message: 'Weekly digest preference must be a boolean'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export type ValidationState<T> = {
  [K in keyof T]: {
    value: T[K]
    errors: string[]
    touched: boolean
  }
}

export type ValidationAction<T> = 
  | { type: 'SET_FIELD_VALUE'; field: keyof T; value: unknown }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; errors: string[] }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof T }
  | { type: 'RESET_FORM' }

export function validationReducer<T>(state: ValidationState<T>, action: ValidationAction<T>): ValidationState<T> {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value
        }
      }
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          errors: action.errors
        }
      }
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          touched: true
        }
      }
    case 'RESET_FORM':
      return Object.keys(state).reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: '',
          errors: [],
          touched: false
        }
      }), {} as ValidationState<T>)
    default:
      return state
  }
}

export async function validateField<T>(
  field: keyof T,
  value: unknown,
  schema: z.ZodType<T>
): Promise<string[]> {
  try {
    await schema.parseAsync({ [field]: value })
    return []
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => err.message)
    }
    return ['Validation failed']
  }
}

export async function validateForm<T>(
  values: Partial<T>,
  schema: z.ZodType<T>
): Promise<Record<keyof T, string[]>> {
  try {
    await schema.parseAsync(values)
    return Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: []
    }), {} as Record<keyof T, string[]>)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path[0] as keyof T
        return {
          ...acc,
          [path]: [...(acc[path] || []), err.message]
        }
      }, {} as Record<keyof T, string[]>)
      return errors
    }
    return Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: ['Validation failed']
    }), {} as Record<keyof T, string[]>)
  }
}

export enum TalentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FEATURED = 'FEATURED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
} 
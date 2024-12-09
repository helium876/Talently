import { z } from 'zod'
import { TalentStatus } from './data'

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
})

export type LoginFormData = z.infer<typeof loginSchema>

export const talentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  status: z.enum(['ACTIVE', 'FEATURED', 'INACTIVE'] as const, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status'
  }),
  
  skills: z.array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills allowed'),
  
  experience: z.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience must be less than 50 years'),
  
  hourlyRate: z.number()
    .min(0, 'Hourly rate cannot be negative')
    .max(1000, 'Hourly rate must be less than $1000'),
  
  availability: z.string()
    .min(10, 'Please provide more details about availability')
    .max(500, 'Availability description is too long'),
  
  businessId: z.string()
    .min(1, 'Business ID is required')
})

export type TalentFormData = z.infer<typeof talentSchema>

export const bookingSchema = z.object({
  talentId: z.string()
    .min(1, 'Talent ID is required'),
  
  businessId: z.string()
    .min(1, 'Business ID is required'),
  
  startDate: z.string()
    .min(1, 'Start date is required'),
  
  endDate: z.string()
    .min(1, 'End date is required'),
  
  totalHours: z.number()
    .min(1, 'Total hours must be at least 1')
    .max(168, 'Total hours cannot exceed one week'),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'] as const, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status'
  })
})

export type BookingFormData = z.infer<typeof bookingSchema>

export const businessSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export type BusinessFormData = z.infer<typeof businessSchema>

export interface ValidationError {
  field: string
  message: string
}

export interface EmailPreferencesData {
  marketingEmails: boolean
  bookingNotifications: boolean
  weeklyDigest: boolean
}

export function validateBusinessName(name: string): ValidationError[] {
  const errors: ValidationError[] = []
  if (!name) {
    errors.push({ field: 'name', message: 'Business name is required' })
  } else if (name.length < 2) {
    errors.push({ field: 'name', message: 'Business name must be at least 2 characters' })
  } else if (name.length > 100) {
    errors.push({ field: 'name', message: 'Business name must be less than 100 characters' })
  }
  return errors
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' })
  } else if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' })
  } else if (password.length > 100) {
    errors.push({ field: 'password', message: 'Password must be less than 100 characters' })
  } else if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' })
  } else if (!/[a-z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' })
  } else if (!/[0-9]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' })
  }
  return errors
}

export function validateFileUpload(file: File): ValidationError[] {
  const errors: ValidationError[] = []
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  
  if (!file) {
    errors.push({ field: 'logo', message: 'File is required' })
  } else if (file.size > maxSize) {
    errors.push({ field: 'logo', message: 'File size must be less than 5MB' })
  } else if (!allowedTypes.includes(file.type)) {
    errors.push({ field: 'logo', message: 'File must be an image (JPEG, PNG, or GIF)' })
  }
  return errors
}

export function validateEmailPreferences(prefs: EmailPreferencesData): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof prefs.marketingEmails !== 'boolean') {
    errors.push({ field: 'marketingEmails', message: 'Marketing emails preference must be a boolean' })
  }
  if (typeof prefs.bookingNotifications !== 'boolean') {
    errors.push({ field: 'bookingNotifications', message: 'Booking notifications preference must be a boolean' })
  }
  if (typeof prefs.weeklyDigest !== 'boolean') {
    errors.push({ field: 'weeklyDigest', message: 'Weekly digest preference must be a boolean' })
  }
  return errors
} 
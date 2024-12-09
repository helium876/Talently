import { z } from 'zod'
import config from '../config'

// Common schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(255, 'Email is too long')

export const passwordSchema = z
  .string()
  .min(config.validation.password.minLength, `Password must be at least ${config.validation.password.minLength} characters`)
  .max(config.validation.password.maxLength, `Password cannot exceed ${config.validation.password.maxLength} characters`)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

export const nameSchema = z
  .string()
  .min(config.validation.name.minLength, `Name must be at least ${config.validation.name.minLength} characters`)
  .max(config.validation.name.maxLength, `Name cannot exceed ${config.validation.name.maxLength} characters`)
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  confirmPassword: z.string().optional(),
  logoPath: z.string().optional(),
  emailPreferences: z.object({
    marketingEmails: z.boolean().optional(),
    bookingNotifications: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
  }).optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Talent schemas
export const talentSchema = z.object({
  name: nameSchema,
  basicInfo: z.string()
    .min(config.validation.basicInfo.minLength, `Basic info must be at least ${config.validation.basicInfo.minLength} characters`)
    .max(config.validation.basicInfo.maxLength, `Basic info cannot exceed ${config.validation.basicInfo.maxLength} characters`),
  status: z.enum(['ACTIVE', 'FEATURED', 'INACTIVE']).optional(),
  imagePath: z.string().optional(),
})

export const updateTalentSchema = z.object({
  name: nameSchema.optional(),
  basicInfo: z.string()
    .min(config.validation.basicInfo.minLength, `Basic info must be at least ${config.validation.basicInfo.minLength} characters`)
    .max(config.validation.basicInfo.maxLength, `Basic info cannot exceed ${config.validation.basicInfo.maxLength} characters`)
    .optional(),
  status: z.enum(['ACTIVE', 'FEATURED', 'INACTIVE']).optional(),
  imagePath: z.string().optional(),
})

// Booking schemas
export const bookingSchema = z.object({
  talentId: z.string().min(1, 'Talent ID is required'),
  clientName: nameSchema,
  clientEmail: emailSchema,
  startDate: z.date().min(new Date(), 'Start date must be in the future'),
  endDate: z.date(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

export const updateBookingSchema = z.object({
  clientName: nameSchema.optional(),
  clientEmail: emailSchema.optional(),
  startDate: z.date().min(new Date(), 'Start date must be in the future').optional(),
  endDate: z.date().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type TalentInput = z.infer<typeof talentSchema>
export type UpdateTalentInput = z.infer<typeof updateTalentSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema> 
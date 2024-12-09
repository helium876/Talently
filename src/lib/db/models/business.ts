import { Schema, model, models, Model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../../config'

export interface EmailPreferences {
  marketingEmails: boolean
  bookingNotifications: boolean
  weeklyDigest: boolean
}

export interface Business extends Document {
  name: string
  email: string
  password: string
  logoPath?: string
  emailPreferences: EmailPreferences
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const emailPreferencesSchema = new Schema<EmailPreferences>({
  marketingEmails: { type: Boolean, default: true },
  bookingNotifications: { type: Boolean, default: true },
  weeklyDigest: { type: Boolean, default: true },
}, { _id: false })

const businessSchema = new Schema<Business>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [config.validation.name.minLength, `Name must be at least ${config.validation.name.minLength} characters`],
    maxlength: [config.validation.name.maxLength, `Name cannot exceed ${config.validation.name.maxLength} characters`],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Please enter a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [config.validation.password.minLength, `Password must be at least ${config.validation.password.minLength} characters`],
    maxlength: [config.validation.password.maxLength, `Password cannot exceed ${config.validation.password.maxLength} characters`],
  },
  logoPath: {
    type: String,
    required: false,
  },
  emailPreferences: {
    type: emailPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.__v
      ret.id = ret._id.toString()
      delete ret._id
      return ret
    },
  },
})

// Hash password before saving
businessSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
businessSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

// Create indexes
businessSchema.index({ email: 1 }, { unique: true })
businessSchema.index({ createdAt: 1 })
businessSchema.index({ name: 'text' })

// Export interface for static methods
export interface BusinessModel extends Model<Business> {
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Export model
export const BusinessModel = (models.Business || model<Business, BusinessModel>('Business', businessSchema)) as BusinessModel 
import { Model } from 'mongoose'
import type { Business, EmailPreferences } from './business'
import { BusinessModel } from './business'
import type { Talent, TalentStatus } from './talent'
import { TalentModel } from './talent'
import type { Booking, BookingStatus } from './booking'
import { BookingModel } from './booking'
import type { User } from './user'
import UserModel from './user'

export { UserModel, BusinessModel, TalentModel, BookingModel }

// Type exports
export type {
  Business,
  EmailPreferences,
  Talent,
  TalentStatus,
  Booking,
  BookingStatus,
  User,
}

// Type for model with static methods
export type ModelWithStatics<T, S = {}> = Model<T> & S 
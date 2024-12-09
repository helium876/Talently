// Service exports
export { BusinessService } from './business'
export { TalentService } from './talent'
export { BookingService } from './booking'

// Input type exports
export type {
  CreateBusinessInput,
  UpdateBusinessInput,
} from './business'

export type {
  CreateTalentInput,
  UpdateTalentInput,
  FindTalentsOptions,
} from './talent'

export type {
  CreateBookingInput,
  UpdateBookingInput,
  FindBookingsOptions,
} from './booking'

// Re-export model types
export type {
  BusinessType,
  EmailPreferences,
  TalentType,
  TalentStatus,
  BookingType,
  BookingStatus,
} from '../db/models'

// Re-export database connection
export { dbConnect } from '../db' 
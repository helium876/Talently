// Auth actions
export {
  login,
  signup,
  logout,
  getSession,
  updateProfile,
} from './auth'

// Talent actions
export {
  createTalent,
  updateTalent,
  deleteTalent,
  getTalents,
  getTalent,
  updateTalentStatus,
  getFeaturedTalents,
} from './talent'

// Booking actions
export {
  createBooking,
  updateBooking,
  deleteBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  getUpcomingBookings,
} from './booking'

// Re-export types from data layer
export type {
  Business,
  BusinessType,
  EmailPreferences,
  Talent,
  TalentType,
  TalentStatus,
  Booking,
  BookingType,
  BookingStatus,
  CreateBusinessInput,
  UpdateBusinessInput,
  CreateTalentInput,
  UpdateTalentInput,
  FindTalentsOptions,
  CreateBookingInput,
  UpdateBookingInput,
  FindBookingsOptions,
} from '../data' 
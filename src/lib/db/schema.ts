import { Generated, Insertable, Selectable, Updateable } from 'kysely'

// Enums
export const TalentStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  FEATURED: 'FEATURED'
} as const

export const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
} as const

export type TalentStatus = typeof TalentStatus[keyof typeof TalentStatus]
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus]

// Database interfaces
interface UsersTable {
  id: Generated<string>
  email: string
  password: string
  resetToken: string | null
  resetTokenExpires: Date | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

interface BusinessesTable {
  id: Generated<string>
  userId: string
  email: string
  password: string
  name: string
  logoPath: string | null
  resetToken: string | null
  resetTokenExpires: Date | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

interface TalentsTable {
  id: Generated<string>
  name: string
  basicInfo: string
  status: TalentStatus
  imagePath: string | null
  businessId: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

interface BookingsTable {
  id: Generated<string>
  clientName: string
  clientEmail: string
  message: string
  status: BookingStatus
  talentId: string
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

// Database interface
export interface Database {
  users: UsersTable
  businesses: BusinessesTable
  talents: TalentsTable
  bookings: BookingsTable
}

// Convenience types for CRUD operations
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

export type Business = Selectable<BusinessesTable>
export type NewBusiness = Insertable<BusinessesTable>
export type BusinessUpdate = Updateable<BusinessesTable>

export type Talent = Selectable<TalentsTable>
export type NewTalent = Insertable<TalentsTable>
export type TalentUpdate = Updateable<TalentsTable>

export type Booking = Selectable<BookingsTable>
export type NewBooking = Insertable<BookingsTable>
export type BookingUpdate = Updateable<BookingsTable> 
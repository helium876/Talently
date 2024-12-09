import { Document, Types } from 'mongoose'
import { TalentStatus, BookingStatus } from './data'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface IBusiness extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  talents: Array<{
    _id: Types.ObjectId
    name: string
    basicInfo: string
    status: TalentStatus
    imagePath: string | null
  }>
  bookings: Array<{
    _id: Types.ObjectId
    clientName: string
    clientEmail: string
    status: BookingStatus
    startDate: Date
    endDate: Date
    notes: string | null
  }>
  createdAt: Date
  updatedAt: Date
}

export interface ITalent extends Document {
  _id: Types.ObjectId
  businessId: Types.ObjectId
  name: string
  basicInfo: string
  status: TalentStatus
  imagePath: string | null
  createdAt: Date
  updatedAt: Date
}

export interface IBooking extends Document {
  _id: Types.ObjectId
  businessId: Types.ObjectId
  talentId: Types.ObjectId
  clientName: string
  clientEmail: string
  status: BookingStatus
  startDate: Date
  endDate: Date
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

// Session types
export interface Session {
  id: string
  email: string
  expiresAt: number
}

// Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface AuthResponse extends ApiResponse {
  token?: string
  redirect?: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData extends LoginFormData {
  name: string
}

export interface TalentFormData {
  name: string
  basicInfo: string
  status?: 'ACTIVE' | 'INACTIVE' | 'FEATURED'
  image?: File
}

export interface BookingFormData {
  talentId: string
  startDate: string
  endDate: string
  clientName: string
  clientEmail: string
  notes?: string
} 